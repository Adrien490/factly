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
		status: params.status,
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
					{
						company: {
							name: { contains: searchTerm, mode: "insensitive" },
						},
					},

					{ company: { siren: { contains: searchTerm, mode: "insensitive" } } },
					{ company: { siret: { contains: searchTerm, mode: "insensitive" } } },
					{
						company: {
							vatNumber: { contains: searchTerm, mode: "insensitive" },
						},
					},
					{
						company: { email: { contains: searchTerm, mode: "insensitive" } },
					},
					{ address: { city: { contains: searchTerm, mode: "insensitive" } } },
				],
			},
		],
	};
};
