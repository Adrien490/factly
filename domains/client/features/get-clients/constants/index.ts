import { AddressType, Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les clients
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */

export const GET_CLIENTS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	organizationId: true,
	id: true,
	reference: true,
	name: true,
	email: true,
	phone: true,
	website: true,
	clientType: true,
	status: true,
	// Informations fiscales
	siren: true,
	siret: true,
	vatNumber: true,

	// Métadonnées
	userId: true,
	createdAt: true,
	updatedAt: true,

	// Relations avec sélections optimisées
	addresses: {
		select: {
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
		},
		where: {
			isDefault: true,
			addressType: {
				in: [AddressType.BILLING, AddressType.SHIPPING],
			},
		},
	},
} as const satisfies Prisma.ClientSelect;
