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
import { archiveProductCategorySchema } from "../schemas";

export const archiveProductCategory: ServerAction<
	ProductCategory,
	typeof archiveProductCategorySchema
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
		const validation = archiveProductCategorySchema.safeParse({
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

		// 5. Vérification de l'existence de la catégorie
		const existingCategory = await db.productCategory.findUnique({
			where: {
				id,
				organizationId,
			},
			select: {
				id: true,
				name: true,
				status: true,
			},
		});

		if (!existingCategory) {
			return createErrorResponse(
				ActionStatus.NOT_FOUND,
				"La catégorie n'a pas été trouvée"
			);
		}

		// 6. Vérification que la catégorie n'est pas déjà archivée
		if (existingCategory.status === ProductCategoryStatus.ARCHIVED) {
			return createErrorResponse(
				ActionStatus.ERROR,
				"Cette catégorie est déjà archivée"
			);
		}

		// 8. Mise à jour de la catégorie
		const updatedCategory = await db.productCategory.update({
			where: {
				id,
				organizationId,
			},
			data: {
				status: ProductCategoryStatus.ARCHIVED,
			},
		});

		// 9. Invalidation du cache
		revalidateTag(`organizations:${organizationId}:product-categories:${id}`);
		revalidateTag(`organizations:${organizationId}:product-categories`);

		return createSuccessResponse(
			updatedCategory,
			`La catégorie ${existingCategory.name} a été archivée avec succès`
		);
	} catch (error) {
		console.error("[ARCHIVE_PRODUCT_CATEGORY]", error);
		return createErrorResponse(
			ActionStatus.ERROR,
			"Une erreur est survenue lors de l'archivage de la catégorie"
		);
	}
};
