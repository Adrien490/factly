import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les clients
 */
export function buildSearchConditions(
	searchTerm: string
): Prisma.ClientWhereInput[] {
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
	];
}
