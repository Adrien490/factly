"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import {
	AddressType,
	BusinessSector,
	Company,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateCompanySchema } from "../schemas/update-company-schema";

/**
 * Action serveur pour mettre à jour une entreprise existante
 * Validations :
 * - L'utilisateur doit être authentifié
 * - Si isMain est true, vérifier qu'il n'y a pas déjà une autre entreprise principale
 */
export const updateCompany: ServerAction<
	Company,
	typeof updateCompanySchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier une entreprise"
			);
		}

		// 2. Vérification de base des données requises
		const id = formData.get("id");
		if (!id) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'entreprise est requis"
			);
		}

		// 3. Préparation et transformation des données brutes
		const rawData = {
			id: formData.get("id") as string,
			name: formData.get("name") as string,
			logoUrl: formData.get("logoUrl") as string | null,
			email: formData.get("email") as string | null,
			legalForm: formData.get("legalForm") as LegalForm | null,
			siret: formData.get("siret") as string | null,
			siren: formData.get("siren") as string | null,
			phoneNumber: formData.get("phoneNumber") as string | null,
			mobileNumber: formData.get("mobileNumber") as string | null,
			faxNumber: formData.get("faxNumber") as string | null,
			website: formData.get("website") as string | null,
			nafApeCode: formData.get("nafApeCode") as string | null,
			capital: formData.get("capital") as string | null,
			rcs: formData.get("rcs") as string | null,
			vatNumber: formData.get("vatNumber") as string | null,
			businessSector: formData.get("businessSector") as BusinessSector | null,
			employeeCount: formData.get("employeeCount") as EmployeeCount | null,
			isMain: formData.get("isMain") === "true",

			// Informations d'adresse
			addressType: formData.get("addressType") as AddressType,
			addressLine1: formData.get("addressLine1") as string,
			addressLine2: formData.get("addressLine2") as string,
			postalCode: formData.get("postalCode") as string,
			city: formData.get("city") as string,
			country: (formData.get("country") as Country) || Country.FRANCE,
			latitude: formData.get("latitude")
				? parseFloat(formData.get("latitude") as string)
				: null,
			longitude: formData.get("longitude")
				? parseFloat(formData.get("longitude") as string)
				: null,
		};

		console.log("[UPDATE_COMPANY] Raw data:", rawData);

		// 4. Validation des données avec le schéma Zod
		const validation = updateCompanySchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_COMPANY] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires",
				rawData
			);
		}

		const {
			id: validatedId,
			name,
			logoUrl,
			email,
			legalForm,
			siret,
			siren,
			phoneNumber,
			mobileNumber,
			faxNumber,
			website,
			nafApeCode,
			capital,
			rcs,
			vatNumber,
			businessSector,
			employeeCount,
			isMain,

			// Informations d'adresse
			addressType,
			addressLine1,
			addressLine2,
			postalCode,
			city,
			country,
			latitude,
			longitude,
		} = validation.data;

		// 5. Vérification qu'il n'y a pas déjà une autre entreprise principale si isMain est true
		if (isMain) {
			const existingMainCompany = await db.company.findFirst({
				where: {
					isMain: true,
					id: {
						not: validatedId,
					},
				},
				select: { id: true, name: true },
			});

			if (existingMainCompany) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					`Une autre entreprise principale existe déjà : ${existingMainCompany.name}`
				);
			}
		}

		// 6. Vérification de l'existence de l'entreprise
		const existingCompany = await db.company.findUnique({
			where: { id: validatedId },
			include: {
				addresses: {
					where: { isDefault: true },
				},
			},
		});

		if (!existingCompany) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"L'entreprise à modifier n'existe pas"
			);
		}

		// 7. Mise à jour de l'entreprise dans la base de données
		const existingAddress = existingCompany.addresses[0];

		const company = await db.company.update({
			where: {
				id: validatedId,
			},
			data: {
				name,
				logoUrl,
				email,
				legalForm,
				siret,
				siren,
				phoneNumber,
				mobileNumber,
				faxNumber,
				website,
				nafApeCode,
				capital,
				rcs,
				vatNumber,
				businessSector,
				employeeCount,
				isMain,

				// Mettre à jour ou créer l'adresse si des informations sont fournies
				...(addressLine1 &&
					addressLine1.trim() !== "" && {
						addresses: {
							upsert: {
								where: {
									id: existingAddress?.id ?? "",
								},
								create: {
									addressType,
									addressLine1,
									addressLine2,
									postalCode: postalCode || "",
									city: city || "",
									country: country as Country,
									isDefault: true,
									...(latitude !== null &&
										longitude !== null && {
											latitude,
											longitude,
										}),
								},
								update: {
									addressType,
									addressLine1,
									addressLine2,
									postalCode: postalCode || "",
									city: city || "",
									country: country as Country,
									...(latitude !== null &&
										longitude !== null && {
											latitude,
											longitude,
										}),
								},
							},
						},
					}),
			},
			include: {
				addresses: true,
			},
		});

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag("companies");
		revalidateTag("companies:main");
		revalidateTag(`companies:${validatedId}`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			company,
			`L'entreprise ${company.name} a été mise à jour avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_COMPANY]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour l'entreprise"
		);
	}
};
