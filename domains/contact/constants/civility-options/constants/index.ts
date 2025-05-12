import { Civility } from "@prisma/client";
import { CivilityOption } from "../types";

/**
 * Mapping des civilités vers des libellés plus lisibles
 */
export const CIVILITY_LABELS: Record<Civility, string> = {
	[Civility.MR]: "Monsieur",
	[Civility.MRS]: "Madame",
	[Civility.MS]: "Mademoiselle",
};

/**
 * Descriptions détaillées pour chaque civilité
 */
export const CIVILITY_DESCRIPTIONS: Record<Civility, string> = {
	[Civility.MR]: "Titre de civilité pour un homme",
	[Civility.MRS]: "Titre de civilité pour une femme mariée",
	[Civility.MS]: "Titre de civilité pour une femme non mariée",
};

/**
 * Génère les options de civilité pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getCivilityOptions(): CivilityOption[] {
	return Object.values(Civility).map((civility) => ({
		value: civility,
		label: CIVILITY_LABELS[civility] || String(civility),
		description: CIVILITY_DESCRIPTIONS[civility] || "",
	}));
}

/**
 * Liste complète des options de civilité
 */
export const CIVILITY_OPTIONS = getCivilityOptions();
