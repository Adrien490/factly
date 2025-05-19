import { SupplierType } from "@prisma/client";

export interface SupplierTypeOption {
	value: SupplierType;
	label: string;
	description: string;
	color: string;
}

/**
 * Mapping des types de fournisseur vers des libellés plus lisibles
 */
export const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
	[SupplierType.INDIVIDUAL]: "Particulier",
	[SupplierType.COMPANY]: "Entreprise",
};

/**
 * Descriptions détaillées pour chaque type de fournisseur
 */
export const SUPPLIER_TYPE_DESCRIPTIONS: Record<SupplierType, string> = {
	[SupplierType.INDIVIDUAL]: "Personne physique (consommateur)",
	[SupplierType.COMPANY]: "Personne morale (entreprise, association)",
};

/**
 * Couleurs pour chaque type de fournisseur (palette professionnelle)
 */
export const SUPPLIER_TYPE_COLORS: Record<SupplierType, string> = {
	[SupplierType.INDIVIDUAL]: "#3b82f6", // blue-500
	[SupplierType.COMPANY]: "#10b981", // emerald-500
};

/**
 * Génère les options de type de fournisseur pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getSupplierTypeOptions(): SupplierTypeOption[] {
	return Object.values(SupplierType).map((type) => ({
		value: type,
		label: SUPPLIER_TYPE_LABELS[type] || String(type),
		description: SUPPLIER_TYPE_DESCRIPTIONS[type] || "",
		color: SUPPLIER_TYPE_COLORS[type] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de type de fournisseur
 */
export const SUPPLIER_TYPE_OPTIONS = getSupplierTypeOptions();
