/**
 * Fonction qui génère les liens de navigation pour les catégories de produits
 * @param organizationId ID de l'organisation
 * @returns Un tableau d'objets contenant les liens de navigation
 */
export const getProductCategoryNavigation = (organizationId: string) => [
	{
		label: "Liste des catégories",
		href: `/dashboard/${organizationId}/products/categories`,
	},
	{
		label: "Nouvelle catégorie",
		href: `/dashboard/${organizationId}/products/categories/new`,
	},
	{
		label: "Gestion des statuts",
		href: `/dashboard/${organizationId}/products/categories/statuses`,
	},
];
