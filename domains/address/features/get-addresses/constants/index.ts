import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les adresses
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_ADDRESSES_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	addressType: true,
	addressLine1: true,
	addressLine2: true,
	postalCode: true,
	city: true,
	country: true,
	latitude: true,
	longitude: true,
	isDefault: true,

	// Relations (ID uniquement pour éviter surcharge)
	supplierId: true,
	clientId: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.AddressSelect;
