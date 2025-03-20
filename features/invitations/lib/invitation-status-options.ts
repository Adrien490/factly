/**
 * Définition des statuts d'invitation disponibles
 */
const INVITATION_STATUS_VALUES = ["PENDING", "ACCEPTED", "DECLINED"] as const;

/**
 * Type pour les statuts d'invitation
 */
export type InvitationStatus = (typeof INVITATION_STATUS_VALUES)[number];

/**
 * Options de statut formatées pour l'interface utilisateur
 */
export const INVITATION_STATUS_OPTIONS = [
	{
		label: "En attente",
		value: "PENDING",
		variant: "secondary" as const,
		description: "Invitation en attente de réponse",
	},
	{
		label: "Acceptée",
		value: "ACCEPTED",
		variant: "default" as const,
		description: "Invitation acceptée",
	},
	{
		label: "Refusée",
		value: "DECLINED",
		variant: "destructive" as const,
		description: "Invitation refusée",
	},
];

/**
 * Récupère les informations de configuration pour un statut donné
 */
export function getStatusConfig(
	status: InvitationStatus | string | null | undefined
) {
	const config = INVITATION_STATUS_OPTIONS.find((opt) => opt.value === status);

	if (!config) {
		return {
			label: "Inconnu",
			value: status as string,
			variant: "outline" as const,
			description: "Statut inconnu",
		};
	}

	return config;
}

export default INVITATION_STATUS_VALUES;
