import { LegalForm } from "@prisma/client";

/**
 * Mapping des formes juridiques vers des libellés plus lisibles
 */
export const LEGAL_FORM_LABELS: Record<LegalForm, string> = {
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
 * Options de forme juridique pré-calculées
 * Calculées une seule fois pour plus d'efficacité
 */
export const LEGAL_FORMS = Object.values(LegalForm).map((form) => ({
	label: LEGAL_FORM_LABELS[form],
	value: form,
}));

// Export par défaut pour faciliter l'import
