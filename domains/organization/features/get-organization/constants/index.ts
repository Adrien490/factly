import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour une organisation
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_ORGANIZATION_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	slug: true,
	company: true,
	address: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.OrganizationSelect;
