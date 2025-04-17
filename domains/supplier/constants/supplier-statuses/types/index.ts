import { SupplierStatus } from "@prisma/client";

/**
 * Interface pour les options de statut fournisseur
 */
export interface SupplierStatusOption {
	value: SupplierStatus;
	label: string;
	description: string;
	color: string; // Couleur pour affichage visuel (badges, indicateurs)
}
