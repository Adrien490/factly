import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour les organisations
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_ORGANIZATIONS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	slug: true,
	company: true,
	address: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.OrganizationSelect;

export const ORGANIZATION_SORTABLE_FIELDS = [
	"companyName",
	"createdAt",
] as const;

export const ORGANIZATION_SORT_OPTIONS = ORGANIZATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "companyName"
					? "Nom"
					: field,
		value: field,
	})
);
