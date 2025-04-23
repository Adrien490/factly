import { FiscalYearStatus } from "@prisma/client";

/**
 * Vérifie si la transition de statut est valide
 */
export function isValidStatusTransition(
	currentStatus: FiscalYearStatus,
	newStatus: FiscalYearStatus
): { isValid: boolean; message?: string } {
	// Règles de transition de statut
	// 1. On ne peut pas revenir à ACTIVE depuis ARCHIVED
	if (
		currentStatus === FiscalYearStatus.ARCHIVED &&
		newStatus === FiscalYearStatus.ACTIVE
	) {
		return {
			isValid: false,
			message: "Impossible de réactiver une année fiscale archivée",
		};
	}

	// 2. On ne peut pas passer directement de ACTIVE à ARCHIVED (doit passer par CLOSED d'abord)
	if (
		currentStatus === FiscalYearStatus.ACTIVE &&
		newStatus === FiscalYearStatus.ARCHIVED
	) {
		return {
			isValid: false,
			message:
				"Une année fiscale doit d'abord être clôturée avant d'être archivée",
		};
	}

	return { isValid: true };
}
