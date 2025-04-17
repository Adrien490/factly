import { SupplierType } from "@prisma/client";
import { SupplierTypeOption } from "../types";

/**
 * Mapping des types de fournisseur vers des libellés plus lisibles
 */
const SUPPLIER_TYPE_LABELS: Record<SupplierType, string> = {
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
const SUPPLIER_TYPE_DESCRIPTIONS: Record<SupplierType, string> = {
	[SupplierType.MANUFACTURER]: "Entreprise qui fabrique les produits",
	[SupplierType.WHOLESALER]: "Entreprise qui vend en gros aux professionnels",
	[SupplierType.DISTRIBUTOR]: "Entreprise qui distribue des produits",
	[SupplierType.RETAILER]: "Entreprise qui vend au détail",
	[SupplierType.SERVICE_PROVIDER]: "Entreprise qui fournit des services",
	[SupplierType.SUBCONTRACTOR]:
		"Entreprise à qui nous déléguons certaines tâches",
};

/**
 * Génère les options de type de fournisseur pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getSupplierTypes(): SupplierTypeOption[] {
	return Object.values(SupplierType).map((type) => ({
		value: type,
		label: SUPPLIER_TYPE_LABELS[type] || String(type),
		description: SUPPLIER_TYPE_DESCRIPTIONS[type] || "",
	}));
}

/**
 * Liste complète des options de type de fournisseur
 */
export const SUPPLIER_TYPES = getSupplierTypes();
