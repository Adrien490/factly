import { AddressType } from "@prisma/client";
import { AddressTypeOption } from "../types";

/**
 * Mapping des types d'adresse vers des libellés plus lisibles
 */
const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
	[AddressType.BILLING]: "Facturation",
	[AddressType.SHIPPING]: "Livraison",
	[AddressType.HEADQUARTERS]: "Siège social",
	[AddressType.WAREHOUSE]: "Entrepôt",
	[AddressType.PRODUCTION]: "Site de production",
	[AddressType.COMMERCIAL]: "Bureau commercial",
};

/**
 * Génère les options de type d'adresse pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getAddressTypes(): AddressTypeOption[] {
	return Object.values(AddressType).map((type) => ({
		value: type,
		label: ADDRESS_TYPE_LABELS[type] || String(type),
	}));
}

/**
 * Liste complète des options de type d'adresse
 */
export const ADDRESS_TYPES = getAddressTypes();
