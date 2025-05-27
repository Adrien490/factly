import { Prisma } from "@prisma/client";

export const GET_MEMBERS_MAX_RESULTS_PER_PAGE = 100;
export const GET_MEMBERS_DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les membres
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */

export const GET_MEMBERS_DEFAULT_SELECT = {
	// Identifiants et informations de base
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

export const GET_MEMBERS_DEFAULT_SORT_BY = "createdAt";

export const GET_MEMBERS_DEFAULT_SORT_ORDER = "desc";

export const GET_MEMBERS_SORT_FIELDS = ["createdAt", "user"] as const;
