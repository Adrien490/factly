import { InvitationStatus } from "@prisma/client";

/**
 * Interface pour les options de statut d'invitation
 */
export interface InvitationStatusOption {
	value: InvitationStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}
