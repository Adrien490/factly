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
import { ProductCategory } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { createProductCategorySchema } from "../schemas";

/**
 * Action serveur pour créer une nouvelle catégorie de produit
 * Validations :
 * - L'utilisateur doit être authentifié
 * - L'utilisateur doit avoir accès à l'organisation
 * - Le slug doit être unique dans l'organisation
 */
export const createProductCategory: ServerAction<
	ProductCategory,
	typeof createProductCategorySchema
> = async (_, formData) => {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			return createErrorResponse(
				ActionStatus.UNAUTHORIZED,
				"Vous devez être connecté pour créer une catégorie de produit"
			);
		}

		// 2. Vérification de base des données requises
		const organizationId = formData.get("organizationId");
		if (!organizationId) {
			return createErrorResponse(
				ActionStatus.VALIDATION_ERROR,
				"L'ID de l'organisation est requis"
			);
		}

		// 4. Préparation et transformation des données brutes
		const name = formData.get("name") as string;

		const rawData = {
			organizationId: organizationId.toString(),
			name,
			description: formData.get("description") as string,
		};

		// 5. Validation des données avec le schéma Zod
		const validation = createProductCategorySchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_PRODUCT_CATEGORY] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'unicité du slug dans l'organisation
		const existingCategory = await db.productCategory.findFirst({
			where: {
				name: validation.data.name,
			},
			select: { id: true },
		});

		if (existingCategory) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Une catégorie avec ce nom existe déjà dans l'organisation"
			);
		}

		// 8. Création de la catégorie dans la base de données
		const { ...categoryData } = validation.data;

		// Créer la catégorie avec les relations appropriées
		const createData = {
			name: categoryData.name,
			description: categoryData.description,
		};

		// Créer la catégorie avec ou sans parent
		const category = await db.productCategory.create({
			data: createData,
		});

		// 9. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(`product-categories`);
		revalidateTag(`product-categories:count`);

		// 10. Retour de la réponse de succès
		return createSuccessResponse(
			category,
			`La catégorie ${category.name} a été créée avec succès`
		);
	} catch (error) {
		console.error("[CREATE_PRODUCT_CATEGORY]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			error instanceof Error
				? error.message
				: "Impossible de créer la catégorie de produit"
		);
	}
};
