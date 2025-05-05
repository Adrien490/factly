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
import { ProductCategory, ProductCategoryStatus } from "@prisma/client";
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

		// 3. Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId.toString());
		if (!hasAccess) {
			return createErrorResponse(
				ActionStatus.FORBIDDEN,
				"Vous n'avez pas accès à cette organisation"
			);
		}

		// 4. Préparation et transformation des données brutes
		const rawData = {
			organizationId: organizationId.toString(),
			name: formData.get("name") as string,
			slug: formData.get("slug") as string,
			description: formData.get("description") as string,
			parentId:
				(formData.get("parentId") as string) === "none" ||
				!formData.get("parentId")
					? null
					: (formData.get("parentId") as string),
			status:
				(formData.get("status") as ProductCategoryStatus) ||
				ProductCategoryStatus.ACTIVE,
		};

		console.log("[CREATE_PRODUCT_CATEGORY] Raw data:", rawData);

		// 5. Validation des données avec le schéma Zod
		const validation = createProductCategorySchema.safeParse(rawData);
		if (!validation.success) {
			console.log(
				"[CREATE_PRODUCT_CATEGORY] Validation errors:",
				validation.error.flatten().fieldErrors
			);
			return createValidationErrorResponse(
				validation.error.flatten().fieldErrors,
				rawData,
				"Veuillez remplir tous les champs obligatoires"
			);
		}

		// 6. Vérification de l'unicité du slug dans l'organisation
		const existingCategory = await db.productCategory.findFirst({
			where: {
				slug: validation.data.slug,
				organizationId: validation.data.organizationId,
			},
			select: { id: true },
		});

		if (existingCategory) {
			return createErrorResponse(
				ActionStatus.CONFLICT,
				"Une catégorie avec ce slug existe déjà dans l'organisation"
			);
		}

		// 7. Si un parent est spécifié, vérifier qu'il existe
		if (validation.data.parentId) {
			const parentCategory = await db.productCategory.findFirst({
				where: {
					id: validation.data.parentId,
					organizationId: validation.data.organizationId,
				},
				select: { id: true },
			});

			if (!parentCategory) {
				return createErrorResponse(
					ActionStatus.NOT_FOUND,
					"La catégorie parente spécifiée n'existe pas"
				);
			}
		}

		// 8. Création de la catégorie dans la base de données
		const { organizationId: validatedOrgId, ...categoryData } = validation.data;

		// Créer la catégorie avec les relations appropriées
		const createData = {
			name: categoryData.name,
			slug: categoryData.slug,
			description: categoryData.description,
			status: categoryData.status,
			organization: { connect: { id: validatedOrgId } },
		};

		// Créer la catégorie avec ou sans parent
		const category = await db.productCategory.create({
			data: categoryData.parentId
				? {
						...createData,
						parent: { connect: { id: categoryData.parentId } },
				  }
				: createData,
		});

		// 9. Invalidation du cache pour forcer un rafraîchissement des données
		revalidateTag(`organizations:${validatedOrgId}:productCategories`);
		revalidateTag(`organizations:${validatedOrgId}:productCategories:count`);

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
