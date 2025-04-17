import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les clients
 * @param searchTerm - Terme de recherche à appliquer sur plusieurs champs
 * @returns Tableau de conditions Prisma à utiliser dans une clause OR
 */
export const buildSearchConditions = (
	searchTerm: string
): Prisma.ClientWhereInput[] => {
	if (!searchTerm.trim()) return [];

	return [
		{ name: { contains: searchTerm, mode: "insensitive" } },
		{ reference: { contains: searchTerm, mode: "insensitive" } },
		{ email: { contains: searchTerm, mode: "insensitive" } },
		{ siren: { contains: searchTerm, mode: "insensitive" } },
		{ siret: { contains: searchTerm, mode: "insensitive" } },
		{ phone: { contains: searchTerm, mode: "insensitive" } },
		{
			addresses: {
				some: { city: { contains: searchTerm, mode: "insensitive" } },
			},
		},
		{
			addresses: {
				some: { postalCode: { contains: searchTerm, mode: "insensitive" } },
			},
		},
		{
			addresses: {
				some: { addressLine1: { contains: searchTerm, mode: "insensitive" } },
			},
		},
	];
};
