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
import { updateProductStatusSchema } from "../schemas";

export const updateProductStatus: ServerAction<
	Product,
	typeof updateProductStatusSchema
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
		const status = formData.get("status") as ProductStatus;

		// 3. Validation des données
		const validation = updateProductStatusSchema.safeParse({
			id,
			organizationId,
			status,
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
				name: true,
			},
		});

		if (!existingProduct) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"Le produit n'a pas été trouvé"
			);
		}

		// 6. Validation de la transition de statut
		const transitionValidation = validateProductStatusTransition({
			currentStatus: existingProduct.status,
			newStatus: validation.data.status,
		});

		if (!transitionValidation.isValid) {
			return createErrorResponse(
				ActionStatus.ERROR,
				transitionValidation.message || "Transition de statut non autorisée"
			);
		}

		// 7. Mise à jour du produit
		const updatedProduct = await db.product.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: validation.data.status,
			},
		});

		// 8. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:products:${id}`);
		revalidateTag(`organizations:${organizationId}:products`);
		revalidateTag(`organizations:${organizationId}:products:count`);

		// 9. Message de succès personnalisé
		let message;

		// Pour l'archivage
		if (validation.data.status === ProductStatus.ARCHIVED) {
			message = `Le produit ${updatedProduct.name} a été archivé avec succès`;
		}
		// Pour la restauration depuis l'archivage
		else if (existingProduct.status === ProductStatus.ARCHIVED) {
			const statusText =
				validation.data.status === ProductStatus.ACTIVE
					? "actif"
					: validation.data.status === ProductStatus.INACTIVE
						? "inactif"
						: validation.data.status === ProductStatus.DRAFT
							? "brouillon"
							: validation.data.status === ProductStatus.DISCONTINUED
								? "obsolète"
								: "autre statut";
			message = `Le produit ${updatedProduct.name} a été restauré en ${statusText} avec succès`;
		}
		// Pour les autres transitions
		else {
			message = `Le statut du produit ${updatedProduct.name} a été mis à jour avec succès`;
		}

		return createSuccessResponse(updatedProduct, message);
	} catch (error) {
		console.error("[UPDATE_PRODUCT_STATUS]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de la mise à jour du statut"
		);
	}
};
