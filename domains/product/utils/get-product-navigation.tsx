/**
 * Génère la navigation pour les produits
 */
export const getProductNavigation = () => [
	{
		title: "Tous les produits",
		url: `/dashboard/products`,
	},
	{
		title: "Nouveau produit",
		url: `/dashboard/products/new`,
	},
	{
		title: "Catégories",
		url: `/dashboard/products/categories`,
	},
];
