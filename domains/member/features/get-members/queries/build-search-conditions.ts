import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les membres
 * @param searchTerm - Terme de recherche à appliquer sur plusieurs champs
 * @returns Tableau de conditions Prisma à utiliser dans une clause OR
 */
export const buildSearchConditions = (
	searchTerm: string
): Prisma.MemberWhereInput[] => {
	if (!searchTerm.trim()) return [];

	return [
		// Recherche dans les informations utilisateur
		{
			user: {
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ email: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		},
	];
};
