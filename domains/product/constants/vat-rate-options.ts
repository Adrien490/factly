// Import de VatRate depuis Prisma quand disponible
// import { VatRate } from "@prisma/client";

/**
 * Énumération des taux de TVA disponibles
 * Reflète l'enum VatRate du schéma Prisma
 */
export enum VatRate {
	STANDARD = "STANDARD", // 20% - Taux normal applicable à la majorité des biens et services
	INTERMEDIATE = "INTERMEDIATE", // 10% - Taux intermédiaire (restauration, transport...)
	REDUCED = "REDUCED", // 5.5% - Taux réduit (alimentation, livres, produits de première nécessité...)
	SUPER_REDUCED = "SUPER_REDUCED", // 2.1% - Taux particulier (médicaments remboursables, presse...)
	ZERO = "ZERO", // 0% - Pour certaines opérations internationales
	EXEMPT = "EXEMPT", // Exonéré - Pour les activités exonérées de TVA
}

/**
 * Interface pour les options de taux de TVA
 */
export interface VatRateOption {
	value: VatRate;
	label: string;
	percentage: number; // Valeur numérique du taux de TVA (ex: 20.0)
	description: string;
	color: string; // Couleur pour affichage visuel
}

/**
 * Mapping des taux de TVA vers des libellés plus lisibles
 */
export const VAT_RATE_LABELS: Record<VatRate, string> = {
	[VatRate.STANDARD]: "Taux normal (20%)",
	[VatRate.INTERMEDIATE]: "Taux intermédiaire (10%)",
	[VatRate.REDUCED]: "Taux réduit (5,5%)",
	[VatRate.SUPER_REDUCED]: "Taux particulier (2,1%)",
	[VatRate.ZERO]: "Taux zéro (0%)",
	[VatRate.EXEMPT]: "Exonéré de TVA",
};

/**
 * Valeurs numériques des taux de TVA
 */
export const VAT_RATE_PERCENTAGES: Record<VatRate, number> = {
	[VatRate.STANDARD]: 20,
	[VatRate.INTERMEDIATE]: 10,
	[VatRate.REDUCED]: 5.5,
	[VatRate.SUPER_REDUCED]: 2.1,
	[VatRate.ZERO]: 0,
	[VatRate.EXEMPT]: 0,
};

/**
 * Descriptions détaillées pour chaque taux de TVA
 */
export const VAT_RATE_DESCRIPTIONS: Record<VatRate, string> = {
	[VatRate.STANDARD]:
		"Taux normal applicable à la majorité des biens et services",
	[VatRate.INTERMEDIATE]:
		"Restauration, transport, rénovation de logements, etc.",
	[VatRate.REDUCED]:
		"Alimentation, livres, produits de première nécessité, etc.",
	[VatRate.SUPER_REDUCED]: "Médicaments remboursables, presse, etc.",
	[VatRate.ZERO]: "Certaines opérations internationales ou DOM-TOM",
	[VatRate.EXEMPT]: "Activités spécifiquement exonérées de TVA",
};

/**
 * Couleurs associées à chaque taux de TVA pour l'affichage visuel
 */
export const VAT_RATE_COLORS: Record<VatRate, string> = {
	[VatRate.STANDARD]: "#ef4444", // Rouge
	[VatRate.INTERMEDIATE]: "#f97316", // Orange
	[VatRate.REDUCED]: "#eab308", // Jaune
	[VatRate.SUPER_REDUCED]: "#22c55e", // Vert
	[VatRate.ZERO]: "#3b82f6", // Bleu
	[VatRate.EXEMPT]: "#94a3b8", // Gris
};

/**
 * Génère les options de taux de TVA pour les composants de formulaire
 * @returns Un tableau d'options prêtes à l'emploi pour les composants de sélection
 */
export function getVatRateOptions(): VatRateOption[] {
	return Object.values(VatRate).map((rate) => ({
		value: rate,
		label: VAT_RATE_LABELS[rate] || String(rate),
		percentage: VAT_RATE_PERCENTAGES[rate] || 0,
		description: VAT_RATE_DESCRIPTIONS[rate] || "",
		color: VAT_RATE_COLORS[rate] || "#cbd5e1",
	}));
}

/**
 * Liste complète des options de taux de TVA
 */
export const VAT_RATE_OPTIONS = getVatRateOptions();
