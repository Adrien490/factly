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
		// Recherche dans la référence
		{ reference: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans les contacts
		{
			contacts: {
				some: {
					OR: [
						{ firstName: { contains: searchTerm, mode: "insensitive" } },
						{ lastName: { contains: searchTerm, mode: "insensitive" } },
						{ email: { contains: searchTerm, mode: "insensitive" } },
						{ phoneNumber: { contains: searchTerm, mode: "insensitive" } },
						{ mobileNumber: { contains: searchTerm, mode: "insensitive" } },
						{ faxNumber: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			},
		},
		// Recherche dans l'entreprise
		{
			company: {
				OR: [
					{ companyName: { contains: searchTerm, mode: "insensitive" } },
					{ siren: { contains: searchTerm, mode: "insensitive" } },
					{ siret: { contains: searchTerm, mode: "insensitive" } },
					{ vatNumber: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		},
		// Recherche dans les adresses
		{
			addresses: {
				some: {
					OR: [
						{ city: { contains: searchTerm, mode: "insensitive" } },
						{ postalCode: { contains: searchTerm, mode: "insensitive" } },
						{ addressLine1: { contains: searchTerm, mode: "insensitive" } },
					],
				},
			},
		},
	];
};
