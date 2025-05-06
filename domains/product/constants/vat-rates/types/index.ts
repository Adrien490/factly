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
