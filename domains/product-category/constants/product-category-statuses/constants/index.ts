import { ProductCategoryStatus } from "@prisma/client";
import { ProductCategoryStatusOption } from "../types";

/**
 * Mapping des statuts de catégorie vers des libellés plus lisibles
 */
const PRODUCT_CATEGORY_STATUS_LABELS: Record<ProductCategoryStatus, string> = {
	[ProductCategoryStatus.ACTIVE]: "Active",
	[ProductCategoryStatus.INACTIVE]: "Inactive",
	[ProductCategoryStatus.ARCHIVED]: "Archivée",
};

/**
 * Descriptions détaillées pour chaque statut de catégorie
 */
const PRODUCT_CATEGORY_STATUS_DESCRIPTIONS: Record<
	ProductCategoryStatus,
	string
> = {
	[ProductCategoryStatus.ACTIVE]: "Catégorie visible et utilisable",
	[ProductCategoryStatus.INACTIVE]: "Catégorie temporairement masquée",
	[ProductCategoryStatus.ARCHIVED]: "Catégorie archivée, non utilisable",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const PRODUCT_CATEGORY_STATUS_COLORS: Record<ProductCategoryStatus, string> = {
	[ProductCategoryStatus.ACTIVE]: "#22c55e", // Vert
	[ProductCategoryStatus.INACTIVE]: "#f97316", // Orange
	[ProductCategoryStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut de catégorie pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getProductCategoryStatuses(): ProductCategoryStatusOption[] {
	return Object.values(ProductCategoryStatus).map((status) => ({
		value: status,
		label: PRODUCT_CATEGORY_STATUS_LABELS[status] || String(status),
		description: PRODUCT_CATEGORY_STATUS_DESCRIPTIONS[status] || "",
		color: PRODUCT_CATEGORY_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut de catégorie
 */
export const PRODUCT_CATEGORY_STATUSES = getProductCategoryStatuses();
