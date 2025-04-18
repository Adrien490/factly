import { ClientType } from "@prisma/client";
import { ClientTypeOption } from "../types";

/**
 * Interface pour les options de type de client
 */

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

const CLIENT_TYPE_COLORS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "#0ea5e9", // Bleu ciel
	[ClientType.COMPANY]: "#0891b2", // Bleu-vert (cyan)
};

/**
 * Génère les options de type de client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getClientTypes(): ClientTypeOption[] {
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
export const CLIENT_TYPES = getClientTypes();
