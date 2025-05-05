import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les catégories de produits
 * @param searchTerm - Terme de recherche à appliquer sur plusieurs champs
 * @returns Tableau de conditions Prisma à utiliser dans une clause OR
 */
export const buildSearchConditions = (
	searchTerm: string
): Prisma.ProductCategoryWhereInput[] => {
	if (!searchTerm.trim()) return [];

	return [
		{ name: { contains: searchTerm, mode: "insensitive" } },
		{ description: { contains: searchTerm, mode: "insensitive" } },
		{ slug: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans les produits associés à la catégorie
		{
			products: {
				some: { name: { contains: searchTerm, mode: "insensitive" } },
			},
		},
		// Recherche dans les catégories parentes
		{
			parent: {
				name: { contains: searchTerm, mode: "insensitive" },
			},
		},
	];
};
