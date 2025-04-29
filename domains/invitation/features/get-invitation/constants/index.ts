import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une invitation
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
export const GET_INVITATION_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	email: true,
	status: true,
	expiresAt: true,
	createdAt: true,
	updatedAt: true,

	// Relations
	organizations: {
		select: {
			id: true,
			name: true,
			logoUrl: true,
		},
	},

	// Relation avec l'utilisateur qui a envoyé l'invitation
	user: {
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	},
} satisfies Prisma.InvitationSelect;
