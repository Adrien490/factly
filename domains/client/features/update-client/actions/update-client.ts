"use server";

import { auth } from "@/domains/auth";
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
import { updateClientSchema } from "../schemas/update-client-schema";

/**
 * Action serveur pour mettre à jour un client existant
 * Validations :
 * - L'utilisateur doit être authentifié
 * - La référence du client doit être unique
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

		// 2. Vérification de l'appartenance
		const membership = await checkMembership({
			userId: session.user.id,
		});

		if (!membership.isMember) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être membre pour effectuer cette action"
			);
		}

		// 3. Vérification de base des données requises
		const id = formData.get("id");
		if (!id) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID du client est requis"
			);
		}

		// 3. Préparation et transformation des données brutes
		const rawData = {
			id: formData.get("id") as string,
			reference: formData.get("reference") as string,
			type: formData.get("type") as ClientType,
			status: formData.get("status") as ClientStatus,

			// Informations de contact
			contactCivility: formData.get("contactCivility") as string,
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
		};

		console.log("[UPDATE_CLIENT] Raw data:", rawData);

		// 4. Validation des données avec le schéma Zod
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
			type,
			status,
			reference,
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
		} = validation.data;

		// 5. Vérification de l'existence de la référence uniquement si elle est fournie
		if (reference) {
			const existingClient = await db.client.findFirst({
				where: {
					reference,
					id: {
						not: validatedId,
					},
				},
				select: { id: true },
			});

			if (existingClient) {
				return createErrorResponse(
					ActionStatus.CONFLICT,
					"Un client avec cette référence existe déjà"
				);
			}
		}

		// 6. Mise à jour du client dans la base de données
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
				// Mettre à jour les informations de l'entreprise si le client est de type COMPANY
				...(type === ClientType.COMPANY && {
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

		// 7. Invalidation du cache
		revalidateTag(`clients`);
		revalidateTag(`clients:${validatedId}`);

		// 8. Retour de la réponse de succès
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
