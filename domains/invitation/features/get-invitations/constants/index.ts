import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour les invitations
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_INVITATIONS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	email: true,
	status: true,

	// Relations
	organization: {
		select: {
			id: true,
			name: true,
			logoUrl: true,
		},
	},

	// Métadonnées
	createdAt: true,
	updatedAt: true,
	expiresAt: true,
} satisfies Prisma.InvitationSelect;

export const INVITATION_SORTABLE_FIELDS = ["createdAt", "expiresAt"] as const;

export const INVITATION_SORT_OPTIONS = INVITATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "expiresAt"
				? "Date d'expiration"
				: field,
		value: field,
	})
);
