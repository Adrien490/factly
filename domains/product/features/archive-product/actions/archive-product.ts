"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { validateProductStatusTransition } from "@/domains/product/utils";
import db from "@/shared/lib/db";
import {
	ActionStatus,
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ServerAction,
} from "@/shared/types/server-action";
import { Product, ProductStatus } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { archiveProductSchema } from "../schemas";

export const archiveProduct: ServerAction<
	Product,
	typeof archiveProductSchema
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

		// 3. Validation des données
		const validation = archiveProductSchema.safeParse({
			id,
			organizationId,
		});
		if (!validation.success) {
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
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

		// 5. Vérification de l'existence du produit
		const existingProduct = await db.product.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				status: true,
			},
		});

		if (!existingProduct) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le produit n'a pas été trouvé"
			);
		}

		// 6. Vérification que le produit n'est pas déjà archivé
		if (existingProduct.status === ProductStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Ce produit est déjà archivé"
			);
		}

		// 6.1 Validation de la transition de statut
		const { isValid, message } = validateProductStatusTransition({
			currentStatus: existingProduct.status,
			newStatus: ProductStatus.ARCHIVED,
		});

		if (!isValid) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				message || "La transition vers le statut ARCHIVED n'est pas autorisée"
			);
		}

		// 7. Mise à jour du produit
		const updatedProduct = await db.product.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: ProductStatus.ARCHIVED,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:products:${id}`);
		revalidateTag(`organizations:${organizationId}:products`);

		return createSuccessResponse(
			updatedProduct,
			"Le produit a été archivé avec succès"
		);
	} catch (error) {
		console.error("[ARCHIVE_PRODUCT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage du produit"
		);
	}
};
