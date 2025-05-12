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
	[SupplierType.MANUFACTURER]: "Fabricant",
	[SupplierType.WHOLESALER]: "Grossiste",
	[SupplierType.DISTRIBUTOR]: "Distributeur",
	[SupplierType.RETAILER]: "Détaillant",
	[SupplierType.SERVICE_PROVIDER]: "Prestataire de services",
	[SupplierType.SUBCONTRACTOR]: "Sous-traitant",
};

/**
 * Descriptions détaillées pour chaque type de fournisseur
 */
export const SUPPLIER_TYPE_DESCRIPTIONS: Record<SupplierType, string> = {
	[SupplierType.MANUFACTURER]: "Entreprise qui fabrique les produits",
	[SupplierType.WHOLESALER]: "Entreprise qui vend en gros aux professionnels",
	[SupplierType.DISTRIBUTOR]: "Entreprise qui distribue des produits",
	[SupplierType.RETAILER]: "Entreprise qui vend au détail",
	[SupplierType.SERVICE_PROVIDER]: "Entreprise qui fournit des services",
	[SupplierType.SUBCONTRACTOR]:
		"Entreprise à qui nous déléguons certaines tâches",
};

/**
 * Couleurs pour chaque type de fournisseur (palette professionnelle)
 */
export const SUPPLIER_TYPE_COLORS: Record<SupplierType, string> = {
	[SupplierType.MANUFACTURER]: "#0369a1", // Bleu profond
	[SupplierType.WHOLESALER]: "#0284c7", // Bleu standard
	[SupplierType.DISTRIBUTOR]: "#0ea5e9", // Bleu clair
	[SupplierType.RETAILER]: "#06b6d4", // Bleu-cyan
	[SupplierType.SERVICE_PROVIDER]: "#0891b2", // Cyan profond
	[SupplierType.SUBCONTRACTOR]: "#14b8a6", // Turquoise
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
