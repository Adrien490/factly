import { ClientStatus } from "@prisma/client";

/**
 * Interface pour les options de statut client
 */
export interface ClientStatusOption {
	value: ClientStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}
