import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour un membre
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_MEMBER_DEFAULT_SELECT = {
	id: true,
	createdAt: true,
	updatedAt: true,
	userId: true,

	// Relations avec sélections optimisées
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			emailVerified: true,
			image: true,
			createdAt: true,
			updatedAt: true,
		},
	},
} as const satisfies Prisma.MemberSelect;
