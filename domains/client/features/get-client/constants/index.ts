import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour un client
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_CLIENT_DEFAULT_SELECT = {
	id: true,
	reference: true,
	type: true,
	status: true,
	company: true,

	contacts: {
		select: {
			id: true,
			civility: true,
			firstName: true,
			lastName: true,
			function: true,
			notes: true,
			email: true,
			phoneNumber: true,
			mobileNumber: true,
			faxNumber: true,
			website: true,
		},
		where: {
			isDefault: true,
		},
	},

	addresses: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.ClientSelect;
