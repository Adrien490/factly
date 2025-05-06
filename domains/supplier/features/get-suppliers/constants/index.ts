import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les fournisseurs
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_SUPPLIERS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	organizationId: true,
	id: true,
	name: true,
	legalName: true,
	email: true,
	phone: true,
	website: true,
	supplierType: true,
	status: true,

	// Informations fiscales
	siren: true,
	siret: true,
	vatNumber: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relations avec sélections optimisées
	addresses: {
		select: {
			id: true,
			addressLine1: true,
			addressLine2: true,
			postalCode: true,
			city: true,
			country: true,
			latitude: true,
			longitude: true,
			isDefault: true,
		},
		where: {
			isDefault: true,
		},
	},
} as const satisfies Prisma.SupplierSelect;

export const GET_SUPPLIERS_DEFAULT_SORT_BY = "createdAt";

export const GET_SUPPLIERS_DEFAULT_SORT_ORDER = "desc";

export const GET_SUPPLIERS_SORT_FIELDS = ["name", "createdAt"] as const;
