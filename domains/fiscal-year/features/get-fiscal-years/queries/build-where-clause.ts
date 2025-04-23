import { Prisma } from "@prisma/client";
import { GetFiscalYearsParams } from "../types";

/**
 * Construit la clause WHERE pour les années fiscales
 * @param params Paramètres de recherche et filtrage
 * @returns Clause WHERE pour Prisma
 */
export const buildWhereClause = (
	params: GetFiscalYearsParams
): Prisma.FiscalYearWhereInput => {
	// Clause de base: récupère seulement les années fiscales de l'organisation spécifiée
	const baseWhere: Prisma.FiscalYearWhereInput = {
		organizationId: params.organizationId,
	};

	// Ajout des filtres optionnels
	if (params.status) {
		baseWhere.status = params.status;
	}

	if (params.isCurrent !== undefined) {
		baseWhere.isCurrent = params.isCurrent;
	}

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
					{ description: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		],
	};
};
