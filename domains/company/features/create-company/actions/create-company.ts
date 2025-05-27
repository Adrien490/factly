"use server";

import { auth } from "@/domains/auth";
import { initAdminRole } from "@/domains/auth/lib/init-permissions";
import { checkMembership } from "@/domains/member/features/check-membership";
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
import { createCompanySchema } from "../schemas/create-company-schema";

/**
 * Action serveur pour créer une nouvelle company
 * Validations :
 * - L'utilisateur doit être authentifié
 * - Si isMain est true, vérifier qu'il n'y a pas déjà une company principale
 */
export const createCompany: ServerAction<
	Company,
	typeof createCompanySchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une entreprise"
			);
		}

		// 2. Vérification de l'appartenance (optionnelle pour la création d'entreprise)
		const membership = await checkMembership({
			userId: session.user.id,
		});

		// 3. Préparation et transformation des données brutes
		const rawData = {
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

		console.log("[CREATE_COMPANY] Raw data:", rawData);

		// 4. Validation des données avec le schéma Zod
		const validation = createCompanySchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_COMPANY] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires",
				rawData
			);
		}

		// 5. Vérification qu'il n'y a pas déjà une company principale dans l'application
		const existingMainCompany = await db.company.findFirst({
			where: {
				isMain: true,
			},
			select: { id: true, name: true },
		});

		if (existingMainCompany) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				`Une entreprise principale existe déjà dans l'application : ${existingMainCompany.name}`
			);
		}

		// 6. Création de la company dans la base de données
		const {
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

		const company = await db.company.create({
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

				// Créer l'adresse si des informations sont fournies
				...(addressLine1 &&
					addressLine1.trim() !== "" && {
						addresses: {
							create: [
								{
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
							],
						},
					}),
			},
		});

		// 7. Création du membership si l'utilisateur n'est pas encore membre
		if (!membership.isMember) {
			await db.member.create({
				data: {
					userId: session.user.id,
				},
			});
			// Invalider le cache du membership
			revalidateTag(`membership:${session.user.id}`);
		}

		// 8. Initialisation du rôle administrateur
		try {
			console.log("🔐 Initialisation du rôle administrateur...");
			await initAdminRole(db, session.user.id);
		} catch (error) {
			console.error(
				"⚠️ Erreur lors de l'initialisation du rôle administrateur:",
				error
			);
			// Ne pas faire échouer la création de l'entreprise si l'init du rôle échoue
		}

		// 9. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag("companies");
		revalidateTag("companies:main");
		revalidateTag(`companies:${company.id}`);
		revalidateTag(`membership:${session.user.id}`);

		// 10. Retour de la réponse de succès
		return createSuccessResponse(
			company,
			`L'entreprise ${company.name} a été créée avec succès. Le rôle administrateur a été configuré.`
		);
	} catch (error) {
		console.error("[CREATE_COMPANY]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer l'entreprise"
		);
	}
};
