import { Prisma } from "@prisma/client";

/**
 * Constantes pour le comptage des catégories de produits
 * VERSION MINIMALISTE pour comptage uniquement
 */
export const COUNT_SELECT = {
	id: true,
} as const satisfies Prisma.ProductCategorySelect;
