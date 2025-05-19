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
} from "@/shared/types";
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
import { updateSupplierSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour un fournisseur existant
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du fournisseur doit être unique dans l'organisation
 */
export const updateSupplier: ServerAction<
	Supplier,
	typeof updateSupplierSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un fournisseur"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const id = formData.get("id");
		if (!organizationId || !id) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation et l'ID du fournisseur sont requis"
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
			id: formData.get("id") as string,
			organizationId: organizationId.toString(),
			reference: formData.get("reference") as string,
			supplierType: formData.get("supplierType") as SupplierType,
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
			contactNotes: formData.get("contactNotes") as string,

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
		const validation = updateSupplierSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_SUPPLIER] Validation errors:",
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
			organizationId: validatedOrgId,
			reference,
			type,
			status,
			contactNotes,

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
		} = validation.data;

		// 6. Vérification de l'existence de la référence uniquement si elle est fournie
		if (reference) {
			const existingSupplier = await db.supplier.findFirst({
				where: {
					reference,
					organizationId: validatedOrgId,
					id: {
						not: validatedId,
					},
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

		// 7. Mise à jour du fournisseur dans la base de données
		const existingContact = await db.contact.findFirst({
			where: {
				supplierId: validatedId,
				isDefault: true,
			},
			select: { id: true },
		});

		const supplier = await db.supplier.update({
			where: {
				id: validatedId,
			},
			data: {
				reference: reference ?? "",
				type,
				status,
				// Mettre à jour le contact principal
				contacts: {
					upsert: {
						where: {
							id: existingContact?.id ?? "",
						},
						create: {
							civility: contactCivility as Civility | null,
							firstName: contactFirstName ?? "",
							lastName: contactLastName ?? "",
							function: contactFunction,
							email: contactEmail,
							notes: contactNotes,
							phoneNumber: contactPhoneNumber,
							mobileNumber: contactMobileNumber,
							faxNumber: contactFaxNumber,
							website: contactWebsite,
							isDefault: true,
						},
						update: {
							civility: contactCivility as Civility | null,
							firstName: contactFirstName ?? "",
							lastName: contactLastName ?? "",
							function: contactFunction,
							notes: contactNotes,
							email: contactEmail,
							phoneNumber: contactPhoneNumber,
							mobileNumber: contactMobileNumber,
							faxNumber: contactFaxNumber,
							website: contactWebsite,
						},
					},
				},
				// Mettre à jour les informations de l'entreprise
				company: {
					update: {
						name: companyName ?? "",
						legalForm: companyLegalForm,
						siren: companySiren,
						siret: companySiret,
						nafApeCode: companyNafApeCode,
						capital: companyCapital,
						rcs: companyRcs,
						vatNumber: companyVatNumber,
						businessSector: companyBusinessSector,
						employeeCount: companyEmployeeCount,
						email: companyEmail,
					},
				},
			},
			include: {
				company: true,
				contacts: {
					where: {
						isDefault: true,
					},
				},
				addresses: {
					where: {
						isDefault: true,
					},
				},
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${validatedOrgId}:suppliers`);
		revalidateTag(`organizations:${validatedOrgId}:suppliers:${validatedId}`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			supplier,
			`Le fournisseur ${supplier.reference} a été modifié avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le fournisseur"
		);
	}
};
