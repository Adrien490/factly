"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
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
	Civility,
	Country,
	EmployeeCount,
	LegalForm,
	Supplier,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createSupplierSchema } from "../schemas/create-supplier-schema";

/**
 * Action serveur pour créer un nouveau fournisseur
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 */
export const createSupplier: ServerAction<
	Supplier,
	typeof createSupplierSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un fournisseur"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			organizationId: organizationId.toString(),
			reference: formData.get("reference") as string,
			type: formData.get("type") as SupplierType,
			status: formData.get("status") as SupplierStatus,

			// Informations de contact
			contactCivility: formData.get("contactCivility") as Civility | null,
			contactFirstName: formData.get("contactFirstName") as string,
			contactLastName: formData.get("contactLastName") as string,
			contactFunction: formData.get("contactFunction") as string,
			contactEmail: formData.get("contactEmail") as string,
			contactPhoneNumber: formData.get("contactPhoneNumber") as string,
			contactMobileNumber: formData.get("contactMobileNumber") as string,
			contactFaxNumber: formData.get("contactFaxNumber") as string,
			contactWebsite: formData.get("contactWebsite") as string,

			// Informations d'entreprise
			companyName: formData.get("companyName") as string,
			companyEmail: formData.get("companyEmail") as string,
			companyLegalForm: formData.get("companyLegalForm") as LegalForm,
			companySiren: formData.get("companySiren") as string,
			companySiret: formData.get("companySiret") as string,
			companyNafApeCode: formData.get("companyNafApeCode") as string,
			companyCapital: formData.get("companyCapital") as string,
			companyRcs: formData.get("companyRcs") as string,
			companyVatNumber: formData.get("companyVatNumber") as string,
			companyBusinessSector: formData.get(
				"companyBusinessSector"
			) as BusinessSector,
			companyEmployeeCount: formData.get(
				"companyEmployeeCount"
			) as EmployeeCount,

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

		// 5. Validation des données avec le schéma Zod
		const validation = createSupplierSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_SUPPLIER] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires",
				rawData
			);
		}

		// 6. Vérification de l'existence de la référence
		if (validation.data.reference) {
			const existingSupplier = await db.supplier.findFirst({
				where: {
					reference: validation.data.reference,
					organizationId: validation.data.organizationId,
				},
				select: { id: true },
			});

			if (existingSupplier) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Un fournisseur avec cette référence existe déjà dans l'organisation"
				);
			}
		}

		// 7. Création du fournisseur dans la base de données
		const {
			organizationId: validatedOrgId,
			type,
			status,
			reference,

			// Informations de contact
			contactCivility,
			contactFirstName,
			contactLastName,
			contactFunction,
			contactEmail,
			contactPhoneNumber,
			contactMobileNumber,
			contactFaxNumber,
			contactWebsite,
			contactNotes,

			// Informations d'entreprise
			companyName,
			companyEmail,
			companyLegalForm,
			companySiren,
			companySiret,
			companyNafApeCode,
			companyCapital,
			companyRcs,
			companyVatNumber,
			companyBusinessSector,
			companyEmployeeCount,

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

		// Créer le fournisseur avec les relations appropriées
		const supplier = await db.supplier.create({
			data: {
				reference: reference ?? "",
				type,
				status,
				organization: { connect: { id: validatedOrgId } },

				// Créer le contact principal
				contacts: {
					create: [
						{
							civility: contactCivility,
							firstName: contactFirstName ?? "",
							lastName: contactLastName ?? "",
							function: contactFunction,
							notes: contactNotes,
							email: contactEmail,
							phoneNumber: contactPhoneNumber,
							mobileNumber: contactMobileNumber,
							faxNumber: contactFaxNumber,
							website: contactWebsite,
							isDefault: true,
						},
					],
				},

				// Créer l'entreprise
				company: {
					create: {
						name: companyName!,
						legalForm: companyLegalForm!,
						siren: companySiren!,
						siret: companySiret!,
						nafApeCode: companyNafApeCode!,
						capital: companyCapital!,
						rcs: companyRcs!,
						vatNumber: companyVatNumber!,
						businessSector: companyBusinessSector!,
						employeeCount: companyEmployeeCount!,
						email: companyEmail || null,
					},
				},

				// Créer l'adresse de facturation si des informations sont fournies
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

		// 8. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(`organizations:${validatedOrgId}:suppliers`);
		revalidateTag(`organizations:${validatedOrgId}:suppliers:count`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			supplier,
			`Le fournisseur ${supplier.reference} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer le fournisseur"
		);
	}
};
