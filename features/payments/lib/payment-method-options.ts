import { PaymentMethod } from "@prisma/client";

/**
 * Interface pour les options de méthode de paiement
 */
export interface PaymentMethodOption {
	value: PaymentMethod;
	label: string;
	description: string;
	icon: string;
	processingTime: string;
	isElectronic: boolean;
}

/**
 * Mapping des méthodes de paiement vers des libellés plus lisibles
 */
const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
	[PaymentMethod.BANK_TRANSFER]: "Virement bancaire",
	[PaymentMethod.CREDIT_CARD]: "Carte bancaire",
	[PaymentMethod.CHECK]: "Chèque",
	[PaymentMethod.CASH]: "Espèces",
	[PaymentMethod.DIRECT_DEBIT]: "Prélèvement automatique",
	[PaymentMethod.PAYPAL]: "PayPal",
	[PaymentMethod.OTHER]: "Autre moyen de paiement",
};

/**
 * Descriptions détaillées pour chaque méthode de paiement
 */
const PAYMENT_METHOD_DESCRIPTIONS: Record<PaymentMethod, string> = {
	[PaymentMethod.BANK_TRANSFER]: "Transfert électronique de compte à compte",
	[PaymentMethod.CREDIT_CARD]: "Paiement par carte de crédit ou débit",
	[PaymentMethod.CHECK]: "Paiement par chèque bancaire",
	[PaymentMethod.CASH]: "Paiement en espèces",
	[PaymentMethod.DIRECT_DEBIT]:
		"Autorisation de prélèvement automatique sur compte bancaire",
	[PaymentMethod.PAYPAL]: "Paiement via le service PayPal",
	[PaymentMethod.OTHER]: "Autre méthode de paiement non listée",
};

/**
 * Icônes associées à chaque méthode de paiement
 */
const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
	[PaymentMethod.BANK_TRANSFER]: "building-bank",
	[PaymentMethod.CREDIT_CARD]: "credit-card",
	[PaymentMethod.CHECK]: "file-check",
	[PaymentMethod.CASH]: "banknote",
	[PaymentMethod.DIRECT_DEBIT]: "repeat",
	[PaymentMethod.PAYPAL]: "paypal",
	[PaymentMethod.OTHER]: "more-horizontal",
};

/**
 * Temps de traitement estimé pour chaque méthode de paiement
 */
const PAYMENT_METHOD_PROCESSING_TIMES: Record<PaymentMethod, string> = {
	[PaymentMethod.BANK_TRANSFER]: "1 à 3 jours ouvrés",
	[PaymentMethod.CREDIT_CARD]: "Instantané",
	[PaymentMethod.CHECK]: "5 à 10 jours ouvrés",
	[PaymentMethod.CASH]: "Instantané",
	[PaymentMethod.DIRECT_DEBIT]: "2 à 3 jours ouvrés",
	[PaymentMethod.PAYPAL]: "Instantané",
	[PaymentMethod.OTHER]: "Variable",
};

/**
 * Indique si la méthode de paiement est électronique
 */
const PAYMENT_METHOD_IS_ELECTRONIC: Record<PaymentMethod, boolean> = {
	[PaymentMethod.BANK_TRANSFER]: true,
	[PaymentMethod.CREDIT_CARD]: true,
	[PaymentMethod.CHECK]: false,
	[PaymentMethod.CASH]: false,
	[PaymentMethod.DIRECT_DEBIT]: true,
	[PaymentMethod.PAYPAL]: true,
	[PaymentMethod.OTHER]: false,
};

/**
 * Génère les options de méthode de paiement pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getPaymentMethodOptions(): PaymentMethodOption[] {
	return Object.values(PaymentMethod).map((method) => ({
		value: method,
		label: PAYMENT_METHOD_LABELS[method] || String(method),
		description: PAYMENT_METHOD_DESCRIPTIONS[method] || "",
		icon: PAYMENT_METHOD_ICONS[method] || "help-circle",
		processingTime: PAYMENT_METHOD_PROCESSING_TIMES[method] || "Variable",
		isElectronic: PAYMENT_METHOD_IS_ELECTRONIC[method] || false,
	}));
}

/**
 * Retourne les méthodes de paiement électroniques uniquement
 */
export function getElectronicPaymentMethods(): PaymentMethodOption[] {
	return getPaymentMethodOptions().filter((option) => option.isElectronic);
}

/**
 * Liste complète des options de méthode de paiement
 */
const paymentMethodOptions = getPaymentMethodOptions();

export default paymentMethodOptions;
