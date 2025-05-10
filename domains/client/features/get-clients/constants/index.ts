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
	clientType: true,
	status: true,
	// Métadonnées
	createdAt: true,
	updatedAt: true,
	company: true,
	contacts: {
		select: {
			id: true,
			firstName: true,
			civility: true,
			lastName: true,
			email: true,
			phoneNumber: true,
			function: true,
			mobileNumber: true,
			faxNumber: true,
		},
		where: {
			isDefault: true,
		},
	},
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

export const GET_CLIENTS_DEFAULT_SORT_BY = "createdAt";

export const GET_CLIENTS_DEFAULT_SORT_ORDER = "desc";

export const GET_CLIENTS_SORT_FIELDS = [
	"name",
	"createdAt",
	"reference",
] as const;
