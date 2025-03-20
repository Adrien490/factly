import { InvoiceStatus } from "@prisma/client";

/**
 * Interface pour les options de statut de facture
 */
export interface InvoiceStatusOption {
	value: InvoiceStatus;
	label: string;
	description: string;
	color: string;
	icon?: string;
	variant?: "default" | "warning" | "success" | "destructive";
}

/**
 * Mapping des statuts de facture vers des libellés plus lisibles
 */
const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
	[InvoiceStatus.DRAFT]: "Brouillon",
	[InvoiceStatus.SENT]: "Envoyée",
	[InvoiceStatus.PARTIALLY_PAID]: "Partiellement payée",
	[InvoiceStatus.PAID]: "Payée",
	[InvoiceStatus.OVERDUE]: "En retard",
	[InvoiceStatus.CANCELLED]: "Annulée",
};

/**
 * Descriptions détaillées pour chaque statut de facture
 */
const INVOICE_STATUS_DESCRIPTIONS: Record<InvoiceStatus, string> = {
	[InvoiceStatus.DRAFT]:
		"Facture en cours d'édition, non encore envoyée au client",
	[InvoiceStatus.SENT]: "Facture envoyée au client, en attente de paiement",
	[InvoiceStatus.PARTIALLY_PAID]:
		"Facture pour laquelle un paiement partiel a été reçu",
	[InvoiceStatus.PAID]: "Facture entièrement payée",
	[InvoiceStatus.OVERDUE]: "Facture dont l'échéance de paiement est dépassée",
	[InvoiceStatus.CANCELLED]:
		"Facture annulée (ne doit pas être prise en compte)",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
	[InvoiceStatus.DRAFT]: "#94a3b8", // Gris-bleu
	[InvoiceStatus.SENT]: "#3b82f6", // Bleu
	[InvoiceStatus.PARTIALLY_PAID]: "#f59e0b", // Orange-jaune
	[InvoiceStatus.PAID]: "#22c55e", // Vert
	[InvoiceStatus.OVERDUE]: "#dc2626", // Rouge
	[InvoiceStatus.CANCELLED]: "#6b7280", // Gris
};

/**
 * Variantes de style associées à chaque statut
 */
const INVOICE_STATUS_VARIANTS: Record<
	InvoiceStatus,
	"default" | "warning" | "success" | "destructive"
> = {
	[InvoiceStatus.DRAFT]: "default",
	[InvoiceStatus.SENT]: "default",
	[InvoiceStatus.PARTIALLY_PAID]: "warning",
	[InvoiceStatus.PAID]: "success",
	[InvoiceStatus.OVERDUE]: "destructive",
	[InvoiceStatus.CANCELLED]: "default",
};

/**
 * Icônes associées à chaque statut
 */
const INVOICE_STATUS_ICONS: Record<InvoiceStatus, string> = {
	[InvoiceStatus.DRAFT]: "file-text",
	[InvoiceStatus.SENT]: "mail",
	[InvoiceStatus.PARTIALLY_PAID]: "credit-card",
	[InvoiceStatus.PAID]: "check-circle",
	[InvoiceStatus.OVERDUE]: "alert-triangle",
	[InvoiceStatus.CANCELLED]: "x-circle",
};

/**
 * Génère les options de statut de facture pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getInvoiceStatusOptions(): InvoiceStatusOption[] {
	return Object.values(InvoiceStatus).map((status) => ({
		value: status,
		label: INVOICE_STATUS_LABELS[status] || String(status),
		description: INVOICE_STATUS_DESCRIPTIONS[status] || "",
		color: INVOICE_STATUS_COLORS[status] || "#cbd5e1",
		icon: INVOICE_STATUS_ICONS[status],
		variant: INVOICE_STATUS_VARIANTS[status],
	}));
}

/**
 * Liste complète des options de statut de facture
 */
const invoiceStatusOptions = getInvoiceStatusOptions();

export default invoiceStatusOptions;
