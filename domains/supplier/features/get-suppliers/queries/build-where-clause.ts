import { Prisma, SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";
import { getSuppliersSchema } from "../schemas";

/**
 * Construit la clause WHERE de la requête Prisma pour le filtrage des fournisseurs
 * Traite les filtres dynamiques, la recherche textuelle et les conditions de base
 */
export function buildWhereClause(
	params: z.infer<typeof getSuppliersSchema>
): Prisma.SupplierWhereInput {
	// Base de la clause WHERE avec l'organizationId obligatoire
	const whereClause: Prisma.SupplierWhereInput = {
		organizationId: params.organizationId,
	};

	// Traitement de la recherche textuelle si fournie
	if (params.search && params.search.trim() !== "") {
		const searchTerm = params.search.trim();
		whereClause.OR = [
			{ name: { contains: searchTerm, mode: "insensitive" } },
			{ legalName: { contains: searchTerm, mode: "insensitive" } },
			{ email: { contains: searchTerm, mode: "insensitive" } },
			{ siret: { contains: searchTerm, mode: "insensitive" } },
			{ siren: { contains: searchTerm, mode: "insensitive" } },
		];
	}

	// Traitement des filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const AND: Prisma.SupplierWhereInput[] = [];

		// Parcours des filtres fournis dans la requête
		Object.entries(params.filters).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			switch (key) {
				case "status":
					// Filtrage par statut (unique ou multiple)
					if (Array.isArray(value) && value.length > 0) {
						AND.push({
							status: { in: value as SupplierStatus[] },
						});
					} else if (typeof value === "string") {
						AND.push({
							status: value as SupplierStatus,
						});
					}
					break;

				case "supplierType":
					// Filtrage par type (unique ou multiple)
					if (Array.isArray(value) && value.length > 0) {
						AND.push({
							supplierType: { in: value as SupplierType[] },
						});
					} else if (typeof value === "string") {
						AND.push({
							supplierType: value as SupplierType,
						});
					}
					break;

				default:
					// Gestion générique pour les autres filtres
					if (typeof value === "string" && value.trim() !== "") {
						AND.push({
							[key]: { contains: value.trim(), mode: "insensitive" },
						});
					} else if (Array.isArray(value) && value.length > 0) {
						AND.push({
							[key]: { in: value },
						});
					}
			}
		});

		// Ajout des filtres à la clause WHERE
		if (AND.length > 0) {
			if (!whereClause.AND) whereClause.AND = [];
			(whereClause.AND as Prisma.SupplierWhereInput[]).push(...AND);
		}
	}

	return whereClause;
}
