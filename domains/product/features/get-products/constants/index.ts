import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les produits
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_PRODUCTS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	organizationId: true,
	id: true,
	reference: true,
	name: true,
	description: true,
	status: true,
	imageUrl: true,

	// Prix et taxation
	price: true,
	vatRate: true,
	purchasePrice: true,
	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relations avec sélections optimisées
	category: {
		select: {
			id: true,
			name: true,
		},
	},
	supplier: {
		select: {
			id: true,
			name: true,
		},
	},
	// Note: les images sont une relation one-to-many, on peut les sélectionner
	// mais on ne les récupère pas par défaut pour optimiser les performances
} as const satisfies Prisma.ProductSelect;

export const GET_PRODUCTS_DEFAULT_SORT_BY = "createdAt";

export const GET_PRODUCTS_DEFAULT_SORT_ORDER = "desc";

export const GET_PRODUCTS_SORT_FIELDS = [
	"name",
	"createdAt",
	"reference",
	"price",
] as const;
