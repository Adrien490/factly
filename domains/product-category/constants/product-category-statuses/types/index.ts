import { ProductCategoryStatus } from "@prisma/client";

/**
 * Structure d'une option de statut pour les menus déroulants
 */
export interface ProductCategoryStatusOption {
	value: ProductCategoryStatus;
	label: string;
	description: string;
	color: string;
}
