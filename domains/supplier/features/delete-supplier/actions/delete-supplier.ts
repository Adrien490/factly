"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";

import { hasOrganizationAccess } from "@/domains/organization/features";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteSupplierSchema } from "../schemas";

export const deleteSupplier: ServerAction<
	null,
	typeof deleteSupplierSchema
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

		// 2. Vérification de base des données requises
		const rawData = {
			id: formData.get("id") as string,
			organizationId: formData.get("organizationId") as string,
		};

		console.log("[DELETE_SUPPLIER] Form Data:", {
			id: rawData.id,
			organizationId: rawData.organizationId,
		});

		// Vérification que l'organizationId n'est pas vide
		if (!rawData.organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(rawData.organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteSupplierSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du fournisseur
		const existingSupplier = await db.supplier.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!existingSupplier) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Fournisseur introuvable"
			);
		}

		// 6. Suppression
		await db.supplier.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les tags appropriés
		revalidateTag(`organizations:${rawData.organizationId}:suppliers`);
		revalidateTag(
			`organizations:${rawData.organizationId}:supplier:${existingSupplier.id}`
		);
		revalidateTag(`organizations:${rawData.organizationId}:suppliers:count`);

		return createSuccessResponse(null, `Fournisseur supprimé définitivement`);
	} catch (error) {
		console.error("[HARD_DELETE_SUPPLIER]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer définitivement le fournisseur"
		);
	}
};
