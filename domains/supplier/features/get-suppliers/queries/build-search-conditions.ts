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
		// Recherche sur la référence du fournisseur
		{ reference: { contains: searchTerm, mode: "insensitive" } },
		// Recherche sur les informations de l'entreprise
		{
			company: {
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ siret: { contains: searchTerm, mode: "insensitive" } },
					{ siren: { contains: searchTerm, mode: "insensitive" } },
					{ vatNumber: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		},
		// Recherche sur les contacts
		{
			contacts: {
				some: {
					OR: [
						{ firstName: { contains: searchTerm, mode: "insensitive" } },
						{ lastName: { contains: searchTerm, mode: "insensitive" } },
						{ email: { contains: searchTerm, mode: "insensitive" } },
						{ phoneNumber: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			},
		},
		// Recherche sur les adresses
		{
			addresses: {
				some: {
					OR: [
						{ addressLine1: { contains: searchTerm, mode: "insensitive" } },
						{ addressLine2: { contains: searchTerm, mode: "insensitive" } },
						{ city: { contains: searchTerm, mode: "insensitive" } },
						{ postalCode: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			},
		},
	];
};
