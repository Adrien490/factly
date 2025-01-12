import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { auth } from "@/auth";
import db from "@/lib/db";
import {
	ServerActionState,
	ServerActionStatus,
	createErrorResponse,
	createSuccessResponse,
} from "@/types/server-action";
import { revalidateTag } from "next/cache";
import deleteClientsSchema from "../schemas/delete-clients-schema";

type DeleteProgress = {
	total: number;
	current: number;
	deleted: string[];
	failed: string[];
};

export default async function deleteClients(
	state: ServerActionState<DeleteProgress, typeof deleteClientsSchema> | null,
	formData: FormData
) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth();
		if (!session?.user?.id) {
			return createErrorResponse(
				ServerActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour effectuer cette action"
			);
		}

		// 2. Vérification de base des données requises
		const rawIds = formData.getAll("ids");
		const rawOrganizationId = formData.get("organizationId");
		if (
			!rawIds.length ||
			!rawOrganizationId ||
			typeof rawOrganizationId !== "string"
		) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"Aucun client sélectionné ou organisation non spécifiée"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawOrganizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ServerActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteClientsSchema.safeParse({
			ids: rawIds,
			organizationId: rawOrganizationId,
		});

		if (!validation.success) {
			return createErrorResponse(
				ServerActionStatus.VALIDATION_ERROR,
				"Format des identifiants invalide"
			);
		}

		// 5. Opérations sur la base de données
		const { ids, organizationId } = validation.data;
		const progress: DeleteProgress = {
			total: ids.length,
			current: 0,
			deleted: [],
			failed: [],
		};

		const existingClients = await db.client.findMany({
			where: {
				id: { in: ids },
				organizationId,
			},
			select: { id: true },
		});

		if (existingClients.length !== ids.length) {
			return createErrorResponse(
				ServerActionStatus.NOT_FOUND,
				"Certains clients sont introuvables ou non archivés"
			);
		}

		for (const id of ids) {
			try {
				await db.client.delete({
					where: {
						id,
						organizationId,
					},
				});
				progress.deleted.push(id);
			} catch (error) {
				console.error(
					`[HARD_DELETE_CLIENTS] Error deleting client ${id}:`,
					error
				);
				progress.failed.push(id);
			}
			progress.current++;
		}

		revalidateTag("clients");
		revalidateTag(`organization-${organizationId}-clients`);
		revalidateTag(`user-${session.user.id}-references`);

		if (progress.failed.length === 0) {
			return createSuccessResponse(
				progress,
				`${progress.deleted.length} clients supprimés définitivement`
			);
		} else {
			return createSuccessResponse(
				progress,
				`${progress.deleted.length} clients supprimés définitivement, ${progress.failed.length} échecs`
			);
		}
	} catch (error) {
		console.error("[HARD_DELETE_CLIENTS]", error);
		return createErrorResponse(
			ServerActionStatus.ERROR,
			"Impossible de supprimer définitivement les clients"
		);
	}
}
