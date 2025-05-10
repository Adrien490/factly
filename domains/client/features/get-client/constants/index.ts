import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour un client
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_CLIENT_DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	clientType: true,
	status: true,
	notes: true,
	company: true,
	contacts: true,
	addresses: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.ClientSelect;
