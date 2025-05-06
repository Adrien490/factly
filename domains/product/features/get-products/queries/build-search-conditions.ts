import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les produits
 * @param searchTerm - Terme de recherche à appliquer sur plusieurs champs
 * @returns Tableau de conditions Prisma à utiliser dans une clause OR
 */
export const buildSearchConditions = (
	searchTerm: string
): Prisma.ProductWhereInput[] => {
	if (!searchTerm.trim()) return [];

	return [
		{ name: { contains: searchTerm, mode: "insensitive" } },
		{ reference: { contains: searchTerm, mode: "insensitive" } },
		{ description: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans les relations
		{
			category: {
				name: { contains: searchTerm, mode: "insensitive" },
			},
		},
		{
			supplier: {
				name: { contains: searchTerm, mode: "insensitive" },
			},
		},
	];
};
