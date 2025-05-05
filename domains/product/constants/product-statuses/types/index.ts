// Temporaire en attendant la mise à jour du client Prisma
// À remplacer par : import { ProductStatus } from "@prisma/client";
export enum ProductStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	DRAFT = "DRAFT",
	DISCONTINUED = "DISCONTINUED",
	ARCHIVED = "ARCHIVED",
}

/**
 * Interface pour les options de statut produit
 */
export interface ProductStatusOption {
	value: ProductStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}
