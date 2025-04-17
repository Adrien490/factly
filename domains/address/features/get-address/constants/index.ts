import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une adresse
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_ADDRESS_DEFAULT_SELECT = {
	id: true,
	addressLine1: true,
	addressLine2: true,
	postalCode: true,
	city: true,
	country: true,
	addressType: true,
	latitude: true,
	longitude: true,
	isDefault: true,
	clientId: true,
	supplierId: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.AddressSelect;
