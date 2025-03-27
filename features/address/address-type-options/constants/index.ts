import { AddressType } from "@prisma/client";
import { AddressTypeOption } from "../types";

/**
 * Interface pour les options de type de client
 */

/**
 * Mapping des types de client vers des libellés plus lisibles
 */
const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
	[AddressType.BILLING]: "Facturation",
	[AddressType.SHIPPING]: "Livraison",
	[AddressType.OTHER]: "Autre",
};

/**
 * Génère les options de type de client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getAddressTypes(): AddressTypeOption[] {
	return Object.values(AddressType).map((type) => ({
		value: type,
		label: ADDRESS_TYPE_LABELS[type] || String(type),
	}));
}

/**
 * Liste complète des options de type de client
 */
export const ADDRESS_TYPE_OPTIONS = getAddressTypes();
