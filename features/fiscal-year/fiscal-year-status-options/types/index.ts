import { FiscalYearStatus } from "@prisma/client";

/**
 * Interface pour les options de statut d'année fiscale
 */
export interface FiscalYearStatusOption {
	value: FiscalYearStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}
