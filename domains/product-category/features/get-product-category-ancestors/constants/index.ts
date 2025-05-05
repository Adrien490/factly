import { Prisma } from "@prisma/client";

/**
 * Sélection des champs pour les ancêtres
 * Optimisée pour ne récupérer que les informations essentielles
 */
export const GET_PRODUCT_CATEGORY_ANCESTORS_SELECT = {
	id: true,
	name: true,
	slug: true,
	parentId: true,
} as const satisfies Prisma.ProductCategorySelect;
