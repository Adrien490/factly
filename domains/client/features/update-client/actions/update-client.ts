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
	BusinessSector,
	Civility,
	Client,
	ClientStatus,
	ClientType,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { updateClientSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour un client existant
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - La référence du client doit être unique dans l'organisation
 */
export const updateClient: ServerAction<
	Client,
	typeof updateClientSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour modifier un client"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		const id = formData.get("id");
		if (!organizationId || !id) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation et l'ID du client sont requis"
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
			organizationId: formData.get("organizationId") as string,
			reference: formData.get("reference") as string,
			clientType: formData.get("clientType") as ClientType,
			status: formData.get("status") as ClientStatus,
			notes: formData.get("notes") as string,

			// Informations de contact
			contactCivility: formData.get("contactCivility") as Civility,
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
		};

		console.log("[UPDATE_CLIENT] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = updateClientSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_CLIENT] Validation errors:",
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
			clientType,
			status,
			reference,
			notes,

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
		} = validation.data;

		// 6. Vérification de l'existence de la référence uniquement si elle est fournie
		if (reference) {
			const existingClient = await db.client.findFirst({
				where: {
					reference,
					organizationId: validatedOrgId,
					id: {
						not: validatedId,
					},
				},
				select: { id: true },
			});

			if (existingClient) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Un client avec cette référence existe déjà dans l'organisation"
				);
			}
		}

		// 7. Mise à jour du client dans la base de données
		const existingContact = await db.contact.findFirst({
			where: {
				clientId: validatedId,
				isDefault: true,
			},
			select: { id: true },
		});

		const client = await db.client.update({
			where: {
				id: validatedId,
			},
			data: {
				reference: reference ?? "",
				clientType,
				status,
				notes,
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
							email: contactEmail,
							phoneNumber: contactPhoneNumber,
							mobileNumber: contactMobileNumber,
							faxNumber: contactFaxNumber,
							website: contactWebsite,
						},
					},
				},
				// Mettre à jour ou créer les informations de l'entreprise si le client est de type COMPANY
				...(clientType === ClientType.COMPANY && {
					company: {
						upsert: {
							create: {
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
				}),
			},
			include: {
				company: true,
				contacts: {
					where: {
						isDefault: true,
					},
				},
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${validatedOrgId}:clients`);
		revalidateTag(`organizations:${validatedOrgId}:clients:${validatedId}`);

		// 9. Retour de la réponse de succès
		return createSuccessResponse(
			client,
			`Le client ${client.reference} a été modifié avec succès`,
			rawData
		);
	} catch (error) {
		console.error("[UPDATE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de modifier le client"
		);
	}
};
