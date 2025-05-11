import { Prisma } from "@prisma/client";

/**
 * Construit les conditions de recherche pour les contacts
 * @param searchTerm - Terme de recherche à appliquer sur plusieurs champs
 * @returns Tableau de conditions Prisma à utiliser dans une clause OR
 */
export const buildSearchConditions = (
	searchTerm: string
): Prisma.ContactWhereInput[] => {
	if (!searchTerm.trim()) return [];

	return [
		// Recherche dans le prénom
		{ firstName: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans le nom
		{ lastName: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans l'email
		{ email: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans le numéro de téléphone
		{ phoneNumber: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans le numéro de mobile
		{ mobileNumber: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans le numéro de fax
		{ faxNumber: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans le site web
		{ website: { contains: searchTerm, mode: "insensitive" } },
		// Recherche dans la fonction
		{ function: { contains: searchTerm, mode: "insensitive" } },
	];
};
