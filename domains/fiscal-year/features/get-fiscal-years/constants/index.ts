import { Prisma } from "@prisma/client";

/**
 * Sélection par défaut des champs pour les années fiscales
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
export const GET_FISCAL_YEARS_DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	name: true,
	description: true,

	// Dates et statut
	startDate: true,
	endDate: true,
	status: true,
	isCurrent: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.FiscalYearSelect;

export const FISCAL_YEAR_SORTABLE_FIELDS = [
	"startDate",
	"name",
	"createdAt",
] as const;

export const FISCAL_YEAR_SORT_OPTIONS = FISCAL_YEAR_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "name"
					? "Nom"
					: field === "startDate"
						? "Date de début"
						: field,
		value: field,
	})
);
