import { Prisma } from "@prisma/client";
import { GetOrganizationsParams } from "../types";

/**
 * Construit la clause WHERE pour les organisations
 * @param params Paramètres de recherche et filtrage
 * @param userId ID de l'utilisateur actuel
 * @returns Clause WHERE pour Prisma
 */
export const buildWhereClause = (
	params: GetOrganizationsParams,
	userId: string
): Prisma.OrganizationWhereInput => {
	// Clause de base: récupère seulement les organisations dont l'utilisateur est membre
	const baseWhere: Prisma.OrganizationWhereInput = {
		members: {
			some: {
				userId,
			},
		},
	};

	// Si pas de recherche, retourne la clause de base
	if (!params.search) {
		return baseWhere;
	}

	// Sinon, ajoute les conditions de recherche
	const searchTerm = params.search.trim().toLowerCase();
	return {
		AND: [
			baseWhere,
			{
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ legalName: { contains: searchTerm, mode: "insensitive" } },
					{ siren: { contains: searchTerm, mode: "insensitive" } },
					{ siret: { contains: searchTerm, mode: "insensitive" } },
					{ vatNumber: { contains: searchTerm, mode: "insensitive" } },
					{ email: { contains: searchTerm, mode: "insensitive" } },
					{ city: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		],
	};
};
