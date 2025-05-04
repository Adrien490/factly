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
import { Client, ClientStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { restoreClientSchema } from "../schemas";

export const restoreClient: ServerAction<
	Client,
	typeof restoreClientSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Récupération des données
		const id = formData.get("id") as string;
		const organizationId = formData.get("organizationId") as string;
		const status = formData.get("status") as ClientStatus;

		// 3. Validation des données
		const validation = restoreClientSchema.safeParse({
			id,
			organizationId,
			status,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ id, organizationId, status },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 4. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 5. Vérification de l'existence du client
		const existingClient = await db.client.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				status: true,
				name: true,
			},
		});

		if (!existingClient) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le client n'a pas été trouvé"
			);
		}

		// 6. Vérification que le client est bien archivé
		if (existingClient.status !== ClientStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce client n'est pas archivé"
			);
		}

		// 7. Mise à jour du client
		const updatedClient = await db.client.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:clients:${id}`);
		revalidateTag(`organizations:${organizationId}:clients`);

		// 9. Message de succès personnalisé
		const statusText =
			validation.data.status === ClientStatus.ACTIVE
				? "actif"
				: validation.data.status === ClientStatus.LEAD
				? "prospect"
				: validation.data.status === ClientStatus.INACTIVE
				? "inactif"
				: "autre statut";

		const message = `Le client ${existingClient.name} a été restauré en ${statusText} avec succès`;

		return createSuccessResponse(updatedClient, message);
	} catch (error) {
		console.error("[RESTORE_CLIENT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la restauration du client"
		);
	}
};
