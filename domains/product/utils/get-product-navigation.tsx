/**
 * Fonction qui génère les liens de navigation pour les produits
 * @param organizationId ID de l'organisation
 * @returns Un tableau d'objets contenant les liens de navigation
 */
export const getProductNavigation = (organizationId: string) => [
	{
		title: "Produits",
		url: `/dashboard/${organizationId}/products`,
	},
	{
		title: "Nouveau produit",
		url: `/dashboard/${organizationId}/products/new`,
	},
	{
		title: "Catégories",
		url: `/dashboard/${organizationId}/products/categories`,
	},
];
