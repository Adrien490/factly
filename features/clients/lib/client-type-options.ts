import { ClientType } from "@prisma/client";

/**
 * Interface pour les options de type de client
 */
export interface ClientTypeOption {
	value: ClientType;
	label: string;
	description: string;
}

/**
 * Mapping des types de client vers des libellés plus lisibles
 */
const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "Particulier",
	[ClientType.COMPANY]: "Entreprise",
};

/**
 * Descriptions détaillées pour chaque type de client
 */
const CLIENT_TYPE_DESCRIPTIONS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "Personne physique (consommateur)",
	[ClientType.COMPANY]: "Personne morale (entreprise, association)",
};

/**
 * Génère les options de type de client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getClientTypeOptions(): ClientTypeOption[] {
	return Object.values(ClientType).map((type) => ({
		value: type,
		label: CLIENT_TYPE_LABELS[type] || String(type),
		description: CLIENT_TYPE_DESCRIPTIONS[type] || "",
	}));
}

/**
 * Liste complète des options de type de client
 */
const clientTypeOptions = getClientTypeOptions();

export default clientTypeOptions;
