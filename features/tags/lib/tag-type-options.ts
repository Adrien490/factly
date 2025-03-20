import { TagType } from "@prisma/client";

export const TAG_TYPE_OPTIONS = [
	{
		label: "Client",
		value: TagType.CLIENT,
		description: "Tags pour catégoriser les clients",
	},
	{
		label: "Produit",
		value: TagType.PRODUCT,
		description: "Tags pour catégoriser les produits",
	},
	{
		label: "Fournisseur",
		value: TagType.SUPPLIER,
		description: "Tags pour catégoriser les fournisseurs",
	},
];
