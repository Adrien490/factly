import { ProductStatus } from "@prisma/client";

/**
 * Définition des transitions autorisées entre les différents statuts de produit
 * Chaque clé représente un statut de départ, et le tableau associé contient les statuts vers lesquels on peut transitionner
 */
export const PRODUCT_STATUS_TRANSITIONS: Record<
	ProductStatus,
	ProductStatus[]
> = {
	[ProductStatus.ACTIVE]: [
		ProductStatus.INACTIVE,
		ProductStatus.DISCONTINUED,
		ProductStatus.DRAFT,
		ProductStatus.ARCHIVED,
	],
	[ProductStatus.INACTIVE]: [
		ProductStatus.ACTIVE,
		ProductStatus.DISCONTINUED,
		ProductStatus.DRAFT,
		ProductStatus.ARCHIVED,
	],
	[ProductStatus.DRAFT]: [
		ProductStatus.ACTIVE,
		ProductStatus.INACTIVE,
		ProductStatus.ARCHIVED,
	],
	[ProductStatus.DISCONTINUED]: [
		ProductStatus.INACTIVE,
		ProductStatus.ARCHIVED,
	],
	[ProductStatus.ARCHIVED]: [ProductStatus.INACTIVE, ProductStatus.DRAFT],
};
