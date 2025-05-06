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
import { createProductSchema } from "../schemas";

/**
 * Action serveur pour créer un nouveau produit
 * Validations :
 * - L'utilisateur doit être authentifié
 * - La référence doit être unique dans l'organisation
 */
export const createProduct: ServerAction<
	Product,
	typeof createProductSchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer un produit"
			);
		}

		// 2. Préparation et transformation des données brutes
		const rawData = {
			name: formData.get("name") as string,
			reference: formData.get("reference") as string,
			description: formData.get("description") as string,
			status: formData.get("status") as string,
			price: parseFloat(formData.get("price") as string),
			vatRate: formData.get("vatRate") as string,
			weight: formData.get("weight") as string,
			width: formData.get("width") as string,
			height: formData.get("height") as string,
			depth: formData.get("depth") as string,
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
		const validation = createProductSchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_PRODUCT] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 4. Vérification de l'unicité de la référence dans l'organisation
		const existingProduct = await db.product.findFirst({
			where: {
				reference: validation.data.reference,
				organizationId: validation.data.organizationId,
			},
			select: { id: true },
		});

		if (existingProduct) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Un produit avec cette référence existe déjà dans votre organisation"
			);
		}

		// 5. Création du produit dans la base de données
		const product = await db.product.create({
			data: validation.data,
		});

		// 6. Revalidation des tags de cache
		revalidateTag(`organizations:${validation.data.organizationId}:products`);

		// 7. Retour de la réponse de succès
		return createSuccessResponse(
			product,
			`Le produit ${product.name} a été créé avec succès`
		);
	} catch (error) {
		console.error("[CREATE_PRODUCT]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error ? error.message : "Impossible de créer le produit"
		);
	}
};
