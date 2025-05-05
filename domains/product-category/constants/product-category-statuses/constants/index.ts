import { ProductCategoryStatus } from "@prisma/client";
import { ProductCategoryStatusOption } from "../types";

// Définir les statuts que nous voulons utiliser
type ActiveStatus = Extract<ProductCategoryStatus, "ACTIVE" | "ARCHIVED">;

/**
 * Mapping des statuts de catégorie vers des libellés plus lisibles
 */
const PRODUCT_CATEGORY_STATUS_LABELS: Record<ActiveStatus, string> = {
	[ProductCategoryStatus.ACTIVE]: "Active",
	[ProductCategoryStatus.ARCHIVED]: "Archivée",
};

/**
 * Descriptions détaillées pour chaque statut de catégorie
 */
const PRODUCT_CATEGORY_STATUS_DESCRIPTIONS: Record<ActiveStatus, string> = {
	[ProductCategoryStatus.ACTIVE]: "Catégorie visible et utilisable",
	[ProductCategoryStatus.ARCHIVED]: "Catégorie archivée, non utilisable",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const PRODUCT_CATEGORY_STATUS_COLORS: Record<ActiveStatus, string> = {
	[ProductCategoryStatus.ACTIVE]: "#22c55e", // Vert
	[ProductCategoryStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut de catégorie pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getProductCategoryStatuses(): ProductCategoryStatusOption[] {
	const statuses: ActiveStatus[] = [
		ProductCategoryStatus.ACTIVE,
		ProductCategoryStatus.ARCHIVED,
	];

	return statuses.map((status) => ({
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
