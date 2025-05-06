import { ClientStatus } from "@prisma/client";
import { ClientStatusOption } from "../types";

/**
 * Mapping des statuts client vers des libellés plus lisibles
 */
export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
	[ClientStatus.LEAD]: "Lead",
	[ClientStatus.PROSPECT]: "Prospect",
	[ClientStatus.ACTIVE]: "Client actif",
	[ClientStatus.INACTIVE]: "Client inactif",
	[ClientStatus.ARCHIVED]: "Archivé",
};

/**
 * Descriptions détaillées pour chaque statut client
 */
export const CLIENT_STATUS_DESCRIPTIONS: Record<ClientStatus, string> = {
	[ClientStatus.LEAD]: "Contact initial, potentiellement intéressé",
	[ClientStatus.PROSPECT]:
		"A montré un intérêt concret pour nos produits/services",
	[ClientStatus.ACTIVE]: "Client avec lequel nous avons des affaires en cours",
	[ClientStatus.INACTIVE]:
		"Client avec lequel nous n'avons plus d'activité récente",
	[ClientStatus.ARCHIVED]:
		"Client avec lequel nous n'avons plus de relation commerciale",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
	[ClientStatus.LEAD]: "#9333ea", // Violet
	[ClientStatus.PROSPECT]: "#f97316", // Orange
	[ClientStatus.ACTIVE]: "#22c55e", // Vert
	[ClientStatus.INACTIVE]: "#64748b", // Gris-bleu
	[ClientStatus.ARCHIVED]: "#94a3b8", // Gris clair
};

/**
 * Génère les options de statut client pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getClientStatuses(): ClientStatusOption[] {
	return Object.values(ClientStatus).map((status) => ({
		value: status,
		label: CLIENT_STATUS_LABELS[status] || String(status),
		description: CLIENT_STATUS_DESCRIPTIONS[status] || "",
		color: CLIENT_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut client
 */
export const CLIENT_STATUSES = getClientStatuses();
