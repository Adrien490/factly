import { Prisma } from "@prisma/client";

type SortField = "name" | "createdAt" | "updatedAt" | "status";

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
	imageUrl: true,

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

/**
 * Sélection étendue des champs incluant les enfants directs
 */
export const GET_PRODUCT_CATEGORIES_WITH_CHILDREN_SELECT = {
	...GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
	children: {
		select: {
			id: true,
			name: true,
			slug: true,
			status: true,
			parentId: true,
		},
	},
} as const satisfies Prisma.ProductCategorySelect;

/**
 * Sélection complète incluant toutes les relations et métadonnées
 */
export const GET_PRODUCT_CATEGORIES_FULL_SELECT = {
	...GET_PRODUCT_CATEGORIES_WITH_CHILDREN_SELECT,
	parent: {
		select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
	},
	children: {
		select: GET_PRODUCT_CATEGORIES_DEFAULT_SELECT,
	},
	_count: {
		select: {
			children: true,
		},
	},
} as const satisfies Prisma.ProductCategorySelect;

/**
 * Profondeur maximale par défaut pour les requêtes hiérarchiques
 */
export const DEFAULT_MAX_DEPTH = 5;

/**
 * Correspondances entre les champs de tri et les expressions Prisma
 */
export const SORT_FIELD_MAPPING: Record<
	SortField,
	Prisma.ProductCategoryOrderByWithRelationInput
> = {
	name: { name: "asc" },
	createdAt: { createdAt: "desc" },
	updatedAt: { updatedAt: "desc" },
	status: { status: "asc" },
};
