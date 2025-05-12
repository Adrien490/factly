import { ClientType } from "@prisma/client";

export interface ClientTypeOption {
	value: ClientType;
	label: string;
	description: string;
	color: string;
}

/**
 * Interface pour les options de type de client
 */

/**
 * Mapping des types de client vers des libellés plus lisibles
 */
export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "Particulier",
	[ClientType.COMPANY]: "Entreprise",
};

/**
 * Descriptions détaillées pour chaque type de client
 */
export const CLIENT_TYPE_DESCRIPTIONS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "Personne physique (consommateur)",
	[ClientType.COMPANY]: "Personne morale (entreprise, association)",
};

/**
 * Couleurs pour chaque type de client
 */
export const CLIENT_TYPE_COLORS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "#6366f1", // Indigo
	[ClientType.COMPANY]: "#f59e0b", // Ambre
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
		color: CLIENT_TYPE_COLORS[type] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de type de client
 */
export const CLIENT_TYPE_OPTIONS = getClientTypeOptions();
