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
import { deleteMultipleProductsSchema } from "../schemas";

export const deleteMultipleProducts: ServerAction<
	null,
	typeof deleteMultipleProductsSchema
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
		const organizationId = formData.get("organizationId") as string;
		const productIds = formData.getAll("ids") as string[];

		console.log("[DELETE_MULTIPLE_PRODUCTS] Form Data:", {
			ids: productIds,
			organizationId,
		});

		// Vérification que l'organizationId n'est pas vide
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"L'ID de l'organisation est manquant"
			);
		}

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Validation complète des données
		const validation = deleteMultipleProductsSchema.safeParse({
			ids: productIds,
			organizationId,
		});

		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				{ ids: productIds, organizationId },
				"Validation échouée. Veuillez vérifier votre sélection."
			);
		}

		// 5. Vérification de l'existence des produits
		const existingProducts = await db.product.findMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
			select: {
				id: true,
			},
		});

		if (existingProducts.length !== validation.data.ids.length) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Certains produits sont introuvables"
			);
		}

		// 6. Suppression
		await db.product.deleteMany({
			where: {
				id: { in: validation.data.ids },
				organizationId: validation.data.organizationId,
			},
		});

		// Revalidation du cache avec les mêmes tags que get-products
		revalidateTag(`organizations:${organizationId}:products`);
		validation.data.ids.forEach((productId) => {
			revalidateTag(`organizations:${organizationId}:products:${productId}`);
		});
		revalidateTag(`organizations:${organizationId}:products:count`);

		return createSuccessResponse(
			null,
			`${validation.data.ids.length} produit(s) supprimé(s) définitivement`
		);
	} catch (error) {
		console.error("[DELETE_MULTIPLE_PRODUCTS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Impossible de supprimer les produits sélectionnés"
		);
	}
};
