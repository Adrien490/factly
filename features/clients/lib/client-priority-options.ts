import { ClientPriority } from "@prisma/client";

/**
 * Interface pour les options de priorité client
 */
export interface ClientPriorityOption {
	value: ClientPriority;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel
	icon?: string; // Nom d'icône optionnel
}

/**
 * Mapping des priorités client vers des libellés plus lisibles
 */
const CLIENT_PRIORITY_LABELS: Record<ClientPriority, string> = {
	[ClientPriority.LOW]: "Basse",
	[ClientPriority.MEDIUM]: "Moyenne",
	[ClientPriority.HIGH]: "Haute",
	[ClientPriority.STRATEGIC]: "Stratégique",
};

/**
 * Descriptions détaillées pour chaque niveau de priorité
 */
const CLIENT_PRIORITY_DESCRIPTIONS: Record<ClientPriority, string> = {
	[ClientPriority.LOW]: "Client avec un potentiel limité ou de faible activité",
	[ClientPriority.MEDIUM]:
		"Client standard avec un potentiel de développement modéré",
	[ClientPriority.HIGH]:
		"Client important nécessitant une attention particulière",
	[ClientPriority.STRATEGIC]:
		"Client essentiel à l'activité, prioritaire sur tous les aspects",
};

/**
 * Couleurs associées à chaque niveau de priorité
 */
const CLIENT_PRIORITY_COLORS: Record<ClientPriority, string> = {
	[ClientPriority.LOW]: "#94a3b8", // Gris-bleu clair
	[ClientPriority.MEDIUM]: "#3b82f6", // Bleu
	[ClientPriority.HIGH]: "#f59e0b", // Jaune-orange
	[ClientPriority.STRATEGIC]: "#dc2626", // Rouge
};

/**
 * Génère les options de priorité client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getClientPriorityOptions(): ClientPriorityOption[] {
	return Object.values(ClientPriority).map((priority) => ({
		value: priority,
		label: CLIENT_PRIORITY_LABELS[priority] || String(priority),
		description: CLIENT_PRIORITY_DESCRIPTIONS[priority] || "",
		color: CLIENT_PRIORITY_COLORS[priority] || "#cbd5e1",
		icon: getPriorityIcon(priority),
	}));
}

/**
 * Détermine l'icône à utiliser pour chaque niveau de priorité
 * @param priority Le niveau de priorité
 * @returns Le nom de l'icône à utiliser (peut être utilisé avec des bibliothèques d'icônes)
 */
function getPriorityIcon(priority: ClientPriority): string {
	switch (priority) {
		case ClientPriority.LOW:
			return "arrow-down";
		case ClientPriority.MEDIUM:
			return "minus";
		case ClientPriority.HIGH:
			return "arrow-up";
		case ClientPriority.STRATEGIC:
			return "star";
		default:
			return "circle";
	}
}

/**
 * Liste complète des options de priorité client
 */
const clientPriorityOptions = getClientPriorityOptions();

export default clientPriorityOptions;
