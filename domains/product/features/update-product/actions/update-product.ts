"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
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
import { updateProductSchema } from "../schemas";

/**
 * Action serveur pour mettre à jour un produit
 * Validations :
 * - L'utilisateur doit être authentifié
 * - La référence doit être unique dans l'organisation (sauf pour le produit en cours de mise à jour)
 */
export const updateProduct: ServerAction<
	Product,
	typeof updateProductSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour mettre à jour un produit"
			);
		}

		// 2. Préparation et transformation des données brutes
		const rawData = {
			id: formData.get("id") as string,
			name: formData.get("name") as string,
			reference: formData.get("reference") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as string,
			price: parseFloat(formData.get("price") as string),
			vatRate: formData.get("vatRate") as string,
			imageUrl: (formData.get("imageUrl") as string) || null,
			organizationId: formData.get("organizationId") as string,
			categoryId:
				((formData.get("categoryId") as string) || "").trim() === ""
					? null
					: (formData.get("categoryId") as string),
			supplierId:
				((formData.get("supplierId") as string) || "").trim() === ""
					? null
					: (formData.get("supplierId") as string),
		};

		// 3. Validation des données avec le schéma Zod
		const validation = updateProductSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[UPDATE_PRODUCT] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		const { id, organizationId, reference } = validation.data;

		// 4. Vérification de l'unicité de la référence dans l'organisation (sauf pour le produit en cours de mise à jour)
		const existingProduct = await db.product.findFirst({
			where: {
				reference,
				organizationId,
				id: {
					not: id,
				},
			},
			select: { id: true },
		});

		if (existingProduct) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Un autre produit avec cette référence existe déjà dans votre organisation"
			);
		}

		// 5. Mise à jour du produit dans la base de données
		const updatedProduct = await db.product.update({
			where: {
				id,
				organizationId,
			},
			data: {
				name: validation.data.name,
				reference: validation.data.reference,
				description: validation.data.description,
				status: validation.data.status,
				price: validation.data.price,
				vatRate: validation.data.vatRate,
				imageUrl: validation.data.imageUrl,
				categoryId: validation.data.categoryId,
				supplierId: validation.data.supplierId,
			},
		});

		// 6. Revalidation des tags de cache
		revalidateTag(`organizations:${organizationId}:products`);
		revalidateTag(`organizations:${organizationId}:products:${id}`);

		// 7. Retour de la réponse de succès
		return createSuccessResponse(
			updatedProduct,
			`Le produit ${updatedProduct.name} a été mis à jour avec succès`
		);
	} catch (error) {
		console.error("[UPDATE_PRODUCT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de mettre à jour le produit"
		);
	}
};
