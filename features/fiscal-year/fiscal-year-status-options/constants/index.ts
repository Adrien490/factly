import { FiscalYearStatus } from "@prisma/client";
import { FiscalYearStatusOption } from "../types";

/**
 * Mapping des statuts d'année fiscale vers des libellés plus lisibles
 */
const FISCAL_YEAR_STATUS_LABELS: Record<FiscalYearStatus, string> = {
	[FiscalYearStatus.ACTIVE]: "Active",
	[FiscalYearStatus.CLOSED]: "Clôturée",
	[FiscalYearStatus.ARCHIVED]: "Archivée",
};

/**
 * Descriptions détaillées pour chaque statut d'année fiscale
 */
const FISCAL_YEAR_STATUS_DESCRIPTIONS: Record<FiscalYearStatus, string> = {
	[FiscalYearStatus.ACTIVE]: "Année fiscale en cours d'utilisation",
	[FiscalYearStatus.CLOSED]: "Année fiscale terminée et clôturée",
	[FiscalYearStatus.ARCHIVED]: "Année fiscale archivée",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const FISCAL_YEAR_STATUS_COLORS: Record<FiscalYearStatus, string> = {
	[FiscalYearStatus.ACTIVE]: "#22c55e", // Vert
	[FiscalYearStatus.CLOSED]: "#64748b", // Gris-bleu
	[FiscalYearStatus.ARCHIVED]: "#f97316", // Orange
};

/**
 * Génère les options de statut d'année fiscale pour les composants de formulaire
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
 * Liste complète des options de statut d'année fiscale
 */
export const FISCAL_YEAR_STATUS_OPTIONS = getFiscalYearStatuses();
