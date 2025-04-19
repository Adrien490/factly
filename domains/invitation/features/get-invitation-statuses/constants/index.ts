import { InvitationStatus } from "@prisma/client";
import { InvitationStatusOption } from "../types";

/**
 * Mapping des statuts d'invitation vers des libellés plus lisibles
 */
const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
	[InvitationStatus.PENDING]: "En attente",
	[InvitationStatus.ACCEPTED]: "Acceptée",
	[InvitationStatus.REJECTED]: "Refusée",
};

/**
 * Descriptions détaillées pour chaque statut d'invitation
 */
const INVITATION_STATUS_DESCRIPTIONS: Record<InvitationStatus, string> = {
	[InvitationStatus.PENDING]: "Invitation envoyée, en attente de réponse",
	[InvitationStatus.ACCEPTED]: "Invitation acceptée par le destinataire",
	[InvitationStatus.REJECTED]: "Invitation refusée par le destinataire",
};

/**
 * Couleurs associées à chaque statut pour l'affichage visuel
 */
const INVITATION_STATUS_COLORS: Record<InvitationStatus, string> = {
	[InvitationStatus.PENDING]: "#f97316", // Orange
	[InvitationStatus.ACCEPTED]: "#22c55e", // Vert
	[InvitationStatus.REJECTED]: "#ef4444", // Rouge
};

/**
 * Génère les options de statut d'invitation pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getInvitationStatuses(): InvitationStatusOption[] {
	return Object.values(InvitationStatus).map((status) => ({
		value: status,
		label: INVITATION_STATUS_LABELS[status] || String(status),
		description: INVITATION_STATUS_DESCRIPTIONS[status] || "",
		color: INVITATION_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut d'invitation
 */
export const INVITATION_STATUSES = getInvitationStatuses();
