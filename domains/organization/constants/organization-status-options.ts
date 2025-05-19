import { OrganizationStatus } from "@prisma/client";

export interface OrganizationStatusOption {
	value: OrganizationStatus;
	label: string;
	description: string;
	color: string;
}

/**
 * Mapping des statuts d'organisation vers des libellés plus lisibles
 */
export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
	[OrganizationStatus.ACTIVE]: "Active",
	[OrganizationStatus.DELETED]: "Supprimée",
};

/**
 * Descriptions détaillées pour chaque statut d'organisation
 */
export const ORGANIZATION_STATUS_DESCRIPTIONS: Record<
	OrganizationStatus,
	string
> = {
	[OrganizationStatus.ACTIVE]: "Organisation active et utilisable",
	[OrganizationStatus.DELETED]:
		"Organisation supprimée, non visible et non modifiable",
};

/**
 * Couleurs pour chaque statut d'organisation
 */
export const ORGANIZATION_STATUS_COLORS: Record<OrganizationStatus, string> = {
	[OrganizationStatus.ACTIVE]: "#22c55e", // Vert
	[OrganizationStatus.DELETED]: "#ef4444", // Rouge
};

/**
 * Génère les options de statut d'organisation pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getOrganizationStatusOptions(): OrganizationStatusOption[] {
	return Object.values(OrganizationStatus).map((status) => ({
		value: status,
		label: ORGANIZATION_STATUS_LABELS[status] || String(status),
		description: ORGANIZATION_STATUS_DESCRIPTIONS[status] || "",
		color: ORGANIZATION_STATUS_COLORS[status] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de statut d'organisation
 */
export const ORGANIZATION_STATUS_OPTIONS = getOrganizationStatusOptions();
