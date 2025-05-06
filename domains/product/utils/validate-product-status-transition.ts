import { PRODUCT_STATUS_TRANSITIONS } from "@/domains/product/constants/product-status-transitions";
import { ProductStatus } from "@prisma/client";

type ValidateProductStatusTransitionParams = {
	currentStatus: ProductStatus;
	newStatus: ProductStatus;
};

type ValidationResult = {
	isValid: boolean;
	message?: string;
};

/**
 * Validateur de transition de statut pour un produit
 * Définit les règles métier pour les transitions autorisées en utilisant
 * la configuration PRODUCT_STATUS_TRANSITIONS
 */
export function validateProductStatusTransition({
	currentStatus,
	newStatus,
}: ValidateProductStatusTransitionParams): ValidationResult {
	// Si le statut ne change pas, c'est toujours valide
	if (currentStatus === newStatus) {
		return { isValid: true };
	}

	// Vérifier si la transition est autorisée dans la configuration
	const allowedTransitions = PRODUCT_STATUS_TRANSITIONS[currentStatus];

	if (!allowedTransitions) {
		return {
			isValid: false,
			message: `Statut de départ inconnu: ${currentStatus}`,
		};
	}

	// Vérifier si le statut cible est dans les transitions autorisées
	if (allowedTransitions.includes(newStatus)) {
		return { isValid: true };
	}

	return {
		isValid: false,
		message: `La transition de ${currentStatus} vers ${newStatus} n'est pas autorisée`,
	};
}
