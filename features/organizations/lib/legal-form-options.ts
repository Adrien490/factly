import { LegalForm } from "@prisma/client";

/**
 * Mapping des formes juridiques vers des libellés plus lisibles
 */
const LEGAL_FORM_LABELS: Record<LegalForm, string> = {
	[LegalForm.EI]: "Entreprise Individuelle",
	[LegalForm.EIRL]: "Entreprise Individuelle à Responsabilité Limitée",
	[LegalForm.EURL]: "Entreprise Unipersonnelle à Responsabilité Limitée",
	[LegalForm.SARL]: "Société à Responsabilité Limitée",
	[LegalForm.SAS]: "Société par Actions Simplifiée",
	[LegalForm.SASU]: "Société par Actions Simplifiée Unipersonnelle",
	[LegalForm.SA]: "Société Anonyme",
	[LegalForm.SNC]: "Société en Nom Collectif",
	[LegalForm.SCI]: "Société Civile Immobilière",
	[LegalForm.SCOP]: "Société Coopérative et Participative",
	[LegalForm.ASSO]: "Association",
	[LegalForm.AE]: "Auto-Entrepreneur",
	[LegalForm.ME]: "Micro-Entreprise",
	[LegalForm.OTHER]: "Autre forme juridique",
};

/**
 * Génère les options de forme juridique pour les composants de formulaire
 * @param includeAll Si true, inclut toutes les formes juridiques, sinon exclut les formes rares
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getLegalFormOptions(): {
	label: string;
	value: LegalForm;
}[] {
	// Sélection des formes juridiques à inclure
	const formsToInclude = Object.values(LegalForm);

	// Création du tableau d'options
	return formsToInclude.map((form) => ({
		label: LEGAL_FORM_LABELS[form] || String(form),
		value: form,
	}));
}

/**
 * Liste complète des options de forme juridique
 */
const legalFormOptions = getLegalFormOptions();

export default legalFormOptions;
