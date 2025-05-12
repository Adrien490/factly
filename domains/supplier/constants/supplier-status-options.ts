import { SupplierStatus } from "@prisma/client";

/**
 * Interface pour les options de statut fournisseur
 */
export interface SupplierStatusOption {
	value: SupplierStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}

/**
 * Mapping des statuts fournisseur vers des libellés plus lisibles
 */
export const SUPPLIER_STATUS_LABELS: Record<SupplierStatus, string> = {
	[SupplierStatus.ACTIVE]: "Actif",
	[SupplierStatus.INACTIVE]: "Inactif",
	[SupplierStatus.ONBOARDING]: "En intégration",
	[SupplierStatus.BLOCKED]: "Bloqué",
	[SupplierStatus.ARCHIVED]: "Archivé",
};

/**
 * Descriptions détaillées pour chaque statut fournisseur
 */
export const SUPPLIER_STATUS_DESCRIPTIONS: Record<SupplierStatus, string> = {
	[SupplierStatus.ACTIVE]:
		"Fournisseur avec lequel nous travaillons activement",
	[SupplierStatus.INACTIVE]: "Fournisseur temporairement inactif",
	[SupplierStatus.ONBOARDING]: "Fournisseur en cours d'intégration",
	[SupplierStatus.BLOCKED]: "Fournisseur bloqué pour des raisons spécifiques",
	[SupplierStatus.ARCHIVED]: "Fournisseur avec lequel nous ne travaillons plus",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
export const SUPPLIER_STATUS_COLORS: Record<SupplierStatus, string> = {
	[SupplierStatus.ACTIVE]: "#22c55e", // Vert
	[SupplierStatus.INACTIVE]: "#64748b", // Gris-bleu
	[SupplierStatus.ONBOARDING]: "#3b82f6", // Bleu
	[SupplierStatus.BLOCKED]: "#ef4444", // Rouge
	[SupplierStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut fournisseur pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getSupplierStatusOptions(): SupplierStatusOption[] {
	return Object.values(SupplierStatus).map((status) => ({
		value: status,
		label: SUPPLIER_STATUS_LABELS[status] || String(status),
		description: SUPPLIER_STATUS_DESCRIPTIONS[status] || "",
		color: SUPPLIER_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut fournisseur
 */
export const SUPPLIER_STATUS_OPTIONS = getSupplierStatusOptions();
