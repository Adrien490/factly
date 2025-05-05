import { ProductCategoryStatus } from "@prisma/client";

// Type pour représenter une catégorie de produit
export type ProductCategoryNode = {
	id: string;
	name: string;
	slug: string;
	status: ProductCategoryStatus;
	children?: ProductCategoryNode[];
};

// Données statiques pour les catégories de produits
export const mockCategories: ProductCategoryNode[] = [
	{
		id: "cat-1",
		name: "Électronique",
		slug: "electronique",
		status: "ACTIVE",
		children: [
			{
				id: "cat-1-1",
				name: "Ordinateurs",
				slug: "ordinateurs",
				status: "ACTIVE",
				children: [
					{
						id: "cat-1-1-1",
						name: "Portables",
						slug: "portables",
						status: "ACTIVE",
					},
					{
						id: "cat-1-1-2",
						name: "Bureautique",
						slug: "bureautique",
						status: "ACTIVE",
					},
					{
						id: "cat-1-1-3",
						name: "Accessoires",
						slug: "accessoires-ordinateurs",
						status: "INACTIVE",
					},
				],
			},
			{
				id: "cat-1-2",
				name: "Téléphones",
				slug: "telephones",
				status: "ACTIVE",
				children: [
					{
						id: "cat-1-2-1",
						name: "Smartphones",
						slug: "smartphones",
						status: "ACTIVE",
					},
					{
						id: "cat-1-2-2",
						name: "Accessoires",
						slug: "accessoires-telephones",
						status: "ACTIVE",
					},
				],
			},
		],
	},
	{
		id: "cat-2",
		name: "Mobilier",
		slug: "mobilier",
		status: "ACTIVE",
		children: [
			{
				id: "cat-2-1",
				name: "Salon",
				slug: "salon",
				status: "ACTIVE",
			},
			{
				id: "cat-2-2",
				name: "Bureau",
				slug: "bureau",
				status: "ACTIVE",
			},
			{
				id: "cat-2-3",
				name: "Cuisine",
				slug: "cuisine",
				status: "INACTIVE",
			},
		],
	},
	{
		id: "cat-3",
		name: "Mode",
		slug: "mode",
		status: "ACTIVE",
		children: [
			{
				id: "cat-3-1",
				name: "Hommes",
				slug: "hommes",
				status: "ACTIVE",
			},
			{
				id: "cat-3-2",
				name: "Femmes",
				slug: "femmes",
				status: "ACTIVE",
			},
			{
				id: "cat-3-3",
				name: "Enfants",
				slug: "enfants",
				status: "ACTIVE",
			},
			{
				id: "cat-3-4",
				name: "Accessoires",
				slug: "accessoires-mode",
				status: "ARCHIVED",
			},
		],
	},
	{
		id: "cat-4",
		name: "Alimentation",
		slug: "alimentation",
		status: "INACTIVE",
		children: [],
	},
];
