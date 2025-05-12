import { FiscalYearStatus } from "@prisma/client";

/**
 * Interface pour les options de statut client
 */
export interface FiscalYearStatusOption {
	value: FiscalYearStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}

/**
 * Mapping des statuts fiscal vers des libellés plus lisibles
 */
export const FISCAL_YEAR_STATUS_LABELS: Record<FiscalYearStatus, string> = {
	[FiscalYearStatus.ACTIVE]: "Active",
	[FiscalYearStatus.CLOSED]: "Closed",
	[FiscalYearStatus.ARCHIVED]: "Archived",
};

/**
 * Descriptions détaillées pour chaque statut client
 */
export const FISCAL_YEAR_STATUS_DESCRIPTIONS: Record<FiscalYearStatus, string> =
	{
		[FiscalYearStatus.ACTIVE]: "Active",
		[FiscalYearStatus.CLOSED]: "Closed",
		[FiscalYearStatus.ARCHIVED]: "Archived",
	};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
export const FISCAL_YEAR_STATUS_COLORS: Record<FiscalYearStatus, string> = {
	[FiscalYearStatus.ACTIVE]: "#9333ea", // Violet
	[FiscalYearStatus.CLOSED]: "#f97316", // Orange
	[FiscalYearStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getFiscalYearStatuses(): FiscalYearStatusOption[] {
	return Object.values(FiscalYearStatus).map((status) => ({
		value: status,
		label: FISCAL_YEAR_STATUS_LABELS[status] || String(status),
		description: FISCAL_YEAR_STATUS_DESCRIPTIONS[status] || "",
		color: FISCAL_YEAR_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut client (format tableau)
 */
export const FISCAL_YEAR_STATUSES = getFiscalYearStatuses();

/**
 * Map d'accès direct aux statuts par clé pour une performance optimale O(1)
 * À privilégier par rapport à l'utilisation de find() sur le tableau FISCAL_YEAR_STATUSES
 */
export const FISCAL_YEAR_STATUS_MAP: Record<
	FiscalYearStatus,
	FiscalYearStatusOption
> = {
	[FiscalYearStatus.ACTIVE]: {
		value: FiscalYearStatus.ACTIVE,
		label: FISCAL_YEAR_STATUS_LABELS[FiscalYearStatus.ACTIVE],
		description: FISCAL_YEAR_STATUS_DESCRIPTIONS[FiscalYearStatus.ACTIVE],
		color: FISCAL_YEAR_STATUS_COLORS[FiscalYearStatus.ACTIVE],
	},
	[FiscalYearStatus.CLOSED]: {
		value: FiscalYearStatus.CLOSED,
		label: FISCAL_YEAR_STATUS_LABELS[FiscalYearStatus.CLOSED],
		description: FISCAL_YEAR_STATUS_DESCRIPTIONS[FiscalYearStatus.CLOSED],
		color: FISCAL_YEAR_STATUS_COLORS[FiscalYearStatus.CLOSED],
	},
	[FiscalYearStatus.ARCHIVED]: {
		value: FiscalYearStatus.ARCHIVED,
		label: FISCAL_YEAR_STATUS_LABELS[FiscalYearStatus.ARCHIVED],
		description: FISCAL_YEAR_STATUS_DESCRIPTIONS[FiscalYearStatus.ARCHIVED],
		color: FISCAL_YEAR_STATUS_COLORS[FiscalYearStatus.ARCHIVED],
	},
};
