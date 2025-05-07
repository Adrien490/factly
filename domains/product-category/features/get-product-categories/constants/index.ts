import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection récursive pour inclure les parents des catégories
 * Limité à 3 niveaux pour éviter des requêtes trop profondes
 */
export const PARENT_SELECT_RECURSIVE = {
	id: true,
	name: true,
} as const;

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
	status: true,

	// Relations hiérarchiques

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.ProductCategorySelect;
