import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les fournisseurs
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_SUPPLIERS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	organizationId: true,
	reference: true,
	type: true,
	status: true,
	createdAt: true,
	updatedAt: true,

	// Relations avec sélections optimisées
	company: true,
	addresses: true,
	contacts: true,
} as const satisfies Prisma.SupplierSelect;

export const GET_SUPPLIERS_DEFAULT_SORT_BY = "createdAt";

export const GET_SUPPLIERS_DEFAULT_SORT_ORDER = "desc";

export const GET_SUPPLIERS_SORT_FIELDS = [
	"reference",
	"createdAt",
	"type",
	"status",
] as const;
