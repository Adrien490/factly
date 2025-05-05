import { ProductStatus, ProductStatusOption } from "../types";

/**
 * Mapping des statuts produit vers des libellés plus lisibles
 */
const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
	[ProductStatus.ACTIVE]: "Actif",
	[ProductStatus.INACTIVE]: "Inactif",
	[ProductStatus.DRAFT]: "Brouillon",
	[ProductStatus.DISCONTINUED]: "Arrêté",
	[ProductStatus.ARCHIVED]: "Archivé",
};

/**
 * Descriptions détaillées pour chaque statut produit
 */
const PRODUCT_STATUS_DESCRIPTIONS: Record<ProductStatus, string> = {
	[ProductStatus.ACTIVE]: "Produit disponible à la vente",
	[ProductStatus.INACTIVE]: "Temporairement indisponible à la vente",
	[ProductStatus.DRAFT]: "En cours de création, non publié",
	[ProductStatus.DISCONTINUED]: "Plus commercialisé, stock résiduel possible",
	[ProductStatus.ARCHIVED]: "Archivé, non disponible et non visible",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
	[ProductStatus.ACTIVE]: "#22c55e", // Vert
	[ProductStatus.INACTIVE]: "#f97316", // Orange
	[ProductStatus.DRAFT]: "#3b82f6", // Bleu
	[ProductStatus.DISCONTINUED]: "#ef4444", // Rouge
	[ProductStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut produit pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getProductStatuses(): ProductStatusOption[] {
	return Object.values(ProductStatus).map((status) => ({
		value: status,
		label: PRODUCT_STATUS_LABELS[status] || String(status),
		description: PRODUCT_STATUS_DESCRIPTIONS[status] || "",
		color: PRODUCT_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut produit
 */
export const PRODUCT_STATUSES = getProductStatuses();
