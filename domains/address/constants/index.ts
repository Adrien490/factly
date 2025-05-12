import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour les adresses
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	addressLine1: true,
	addressLine2: true,
	postalCode: true,
	city: true,
	country: true,
	latitude: true,
	longitude: true,
	isDefault: true,

	// Relations
	supplierId: true,
	clientId: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.AddressSelect;

export const addressSortableFields = [
	"addressLine1",
	"city",
	"postalCode",
	"country",
	"isDefault",
	"createdAt",
	"updatedAt",
] as const;

export const entityType = ["client", "supplier"] as const;

export * from "./address-type-options";
export * from "./country-options";
