import { ClientStatus } from "@prisma/client";
import { CLIENT_STATUS_TRANSITIONS } from "../constants";

interface ValidateClientStatusTransitionOptions {
	currentStatus: ClientStatus;
	newStatus: ClientStatus;
}

export function validateClientStatusTransition({
	currentStatus,
	newStatus,
}: ValidateClientStatusTransitionOptions): {
	isValid: boolean;
	message?: string;
} {
	// Vérifier si la transition est autorisée selon les règles de base
	const isTransitionAllowed =
		CLIENT_STATUS_TRANSITIONS[currentStatus].includes(newStatus);

	if (!isTransitionAllowed) {
		return {
			isValid: false,
			message: `La transition de ${currentStatus} vers ${newStatus} n'est pas autorisée.`,
		};
	}

	// Règles métier spécifiques
	if (
		currentStatus === ClientStatus.ACTIVE &&
		newStatus === ClientStatus.LEAD
	) {
		return {
			isValid: false,
			message:
				"Un client actif ne peut pas être rétrogradé en lead. Utilisez le statut 'REQUALIFICATION' si nécessaire.",
		};
	}

	if (
		currentStatus === ClientStatus.INACTIVE &&
		newStatus === ClientStatus.LEAD
	) {
		return {
			isValid: false,
			message:
				"Un client inactif ne peut pas être rétrogradé en lead. Utilisez le statut 'REQUALIFICATION' si nécessaire.",
		};
	}

	// Si on arrive ici, la transition est valide
	return { isValid: true };
}
