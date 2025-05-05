import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les catégories de produits
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_PRODUCT_CATEGORIES_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	organizationId: true,
	name: true,
	description: true,
	slug: true,
	status: true,

	// Relations hiérarchiques
	parentId: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relation parent simplifiée
	parent: {
		select: {
			id: true,
			name: true,
			slug: true,
		},
	},
} as const satisfies Prisma.ProductCategorySelect;
