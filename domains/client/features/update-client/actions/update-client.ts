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
			id: id.toString(),
			organizationId: organizationId.toString(),
			reference: formData.get("reference") as string,
			clientType: formData.get("clientType") as ClientType,
			status: formData.get("status") as ClientStatus,
			notes: formData.get("notes") as string,

			// Informations de contact
			civility: formData.get("civility") as Civility,
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			contactFunction: formData.get("contactFunction") as string,
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
			website: formData.get("website") as string,

			// Informations d'entreprise
			companyName: formData.get("companyName") as string,
			legalForm: formData.get("legalForm") as LegalForm,
			siren: formData.get("siren") as string,
			siret: formData.get("siret") as string,
			nafApeCode: formData.get("nafApeCode") as string,
			capital: formData.get("capital") as string,
			rcs: formData.get("rcs") as string,
			vatNumber: formData.get("vatNumber") as string,
			businessSector: formData.get("businessSector") as BusinessSector,
			employeeCount: formData.get("employeeCount") as EmployeeCount,
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
			civility,
			firstName,
			lastName,
			contactFunction,
			email,
			phoneNumber,
			mobileNumber,
			faxNumber,
			website,

			// Informations d'entreprise
			companyName,
			legalForm,
			siren,
			siret,
			nafApeCode,
			capital,
			rcs,
			vatNumber,
			businessSector,
			employeeCount,
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
					updateMany: {
						where: {
							clientId: validatedId,
							isDefault: true,
						},
						data: {
							civility,
							firstName: firstName ?? "",
							lastName: lastName ?? "",
							function: contactFunction,
							email,
							phoneNumber,
							mobileNumber,
							faxNumber,
							website,
						},
					},
				},
				// Mettre à jour ou créer les informations de l'entreprise si le client est de type COMPANY
				...(clientType === ClientType.COMPANY && {
					company: {
						upsert: {
							create: {
								companyName: companyName ?? "",
								legalForm,
								siren,
								siret,
								nafApeCode,
								capital,
								rcs,
								vatNumber,
								businessSector,
								employeeCount,
							},
							update: {
								companyName: companyName ?? "",
								legalForm,
								siren,
								siret,
								nafApeCode,
								capital,
								rcs,
								vatNumber,
								businessSector,
								employeeCount,
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
