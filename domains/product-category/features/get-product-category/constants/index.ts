import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une catégorie de produit
 * Version simplifiée sans inclusions récursives
 */
export const GET_PRODUCT_CATEGORY_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	name: true,
	description: true,
	status: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.ProductCategorySelect;
