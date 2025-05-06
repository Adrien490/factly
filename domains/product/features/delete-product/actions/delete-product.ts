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
import { Product } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { deleteProductSchema } from "../schemas";

export const deleteProduct: ServerAction<
	Product,
	typeof deleteProductSchema
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
		const validation = deleteProductSchema.safeParse(rawData);

		if (!validation.success) {
			console.log(validation.error.flatten().fieldErrors);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Validation échouée. Veuillez vérifier votre saisie."
			);
		}

		// 5. Vérification de l'existence du produit
		const existingProduct = await db.product.findFirst({
			where: {
				id: validation.data.id,
				organizationId: validation.data.organizationId,
			},
		});

		if (!existingProduct) {
			return createErrorResponse(ActionStatus.NOT_FOUND, "Produit introuvable");
		}

		// 6. Suppression
		await db.product.delete({
			where: { id: validation.data.id },
		});

		// Revalidation du cache avec les mêmes tags que get-products
		revalidateTag(`organizations:${rawData.organizationId}:products`);
		revalidateTag(
			`organizations:${rawData.organizationId}:products:${existingProduct.id}`
		);
		revalidateTag(`organizations:${rawData.organizationId}:products:count`);

		return createSuccessResponse(
			existingProduct,
			`Produit "${existingProduct.name}" supprimé définitivement`
		);
	} catch (error) {
		console.error("[HARD_DELETE_PRODUCT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer définitivement le produit"
		);
	}
};
