import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche textuelle pour les fournisseurs
 * @param search - Terme de recherche
 * @returns Tableau de conditions OR pour la recherche textuelle
 */
export const buildSearchConditions = (
	search: string
): Prisma.SupplierWhereInput[] => {
	const searchTerm = search.trim();

	if (!searchTerm) {
		return [];
	}

	return [
		{ name: { contains: searchTerm, mode: "insensitive" } },
		{ legalName: { contains: searchTerm, mode: "insensitive" } },
		{ email: { contains: searchTerm, mode: "insensitive" } },
		{ siret: { contains: searchTerm, mode: "insensitive" } },
		{ siren: { contains: searchTerm, mode: "insensitive" } },
	];
};
