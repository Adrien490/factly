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
			clientType: formData.get("clientType") as string,
			status: formData.get("status") as string,
			notes: formData.get("notes") as string,

			// Champs du contact
			civility: formData.get("civility") as Civility,
			firstname: formData.get("firstname") as string,
			lastname: formData.get("lastname") as string,
			contactFunction: formData.get("contactFunction") as string,
			email: formData.get("email") as string,
			phoneNumber: formData.get("phoneNumber") as string,
			mobileNumber: formData.get("mobileNumber") as string,
			faxNumber: formData.get("faxNumber") as string,
			website: formData.get("website") as string,

			// Champs de l'entreprise
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

		const data = validation.data;

		// 6. Vérification de l'existence de la référence
		const existingClient = await db.client.findFirst({
			where: {
				reference: data.reference,
				organizationId: data.organizationId,
				id: {
					not: data.id,
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

		// 7. Mise à jour du client dans la base de données
		const client = await db.client.update({
			where: {
				id: data.id,
			},
			data: {
				reference: data.reference,
				clientType: data.clientType,
				status: data.status,
				notes: data.notes,
				// Mettre à jour le contact principal
				contacts: {
					updateMany: {
						where: {
							clientId: data.id,
							isDefault: true,
						},
						data: {
							civility: data.civility,
							firstName: data.firstname ?? "",
							lastName: data.lastname ?? "",
							function: data.contactFunction,
							email: data.email,
							phoneNumber: data.phoneNumber,
							mobileNumber: data.mobileNumber,
							faxNumber: data.faxNumber,
							website: data.website,
						},
					},
				},
				// Mettre à jour ou créer les informations de l'entreprise si le client est de type COMPANY
				...(data.clientType === "COMPANY" && {
					company: {
						upsert: {
							create: {
								companyName: data.companyName ?? "",
								legalForm: data.legalForm,
								siren: data.siren,
								siret: data.siret,
								nafApeCode: data.nafApeCode,
								capital: data.capital,
								rcs: data.rcs,
								vatNumber: data.vatNumber,
								businessSector: data.businessSector,
								employeeCount: data.employeeCount,
							},
							update: {
								companyName: data.companyName ?? "",
								legalForm: data.legalForm,
								siren: data.siren,
								siret: data.siret,
								nafApeCode: data.nafApeCode,
								capital: data.capital,
								rcs: data.rcs,
								vatNumber: data.vatNumber,
								businessSector: data.businessSector,
								employeeCount: data.employeeCount,
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
		revalidateTag(`organizations:${data.organizationId}:clients`);
		revalidateTag(`organizations:${data.organizationId}:clients:${data.id}`);

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
