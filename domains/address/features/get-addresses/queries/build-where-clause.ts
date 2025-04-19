import { AddressType, Country, Prisma } from "@prisma/client";
import { z } from "zod";
import { getAddressesSchema } from "../schemas";

/**
 * Construit la clause WHERE de la requête Prisma pour le filtrage des adresses
 * Traite les filtres dynamiques, la recherche textuelle et les conditions de base
 */
export function buildWhereClause(
	params: z.infer<typeof getAddressesSchema>
): Prisma.AddressWhereInput {
	// Base de la clause WHERE avec les identifiants spécifiés
	const whereClause: Prisma.AddressWhereInput = {};

	// Ajout des identifiants relationnels
	if (params.clientId) {
		whereClause.clientId = params.clientId;
	}

	if (params.supplierId) {
		whereClause.supplierId = params.supplierId;
	}

	// Traitement de la recherche textuelle si fournie
	if (params.search && params.search.trim() !== "") {
		const searchTerm = params.search.trim();
		whereClause.OR = [
			{ addressLine1: { contains: searchTerm, mode: "insensitive" } },
			{ addressLine2: { contains: searchTerm, mode: "insensitive" } },
			{ city: { contains: searchTerm, mode: "insensitive" } },
			{ postalCode: { contains: searchTerm, mode: "insensitive" } },
			{ country: { equals: searchTerm as Country } },
		];
	}

	// Traitement des filtres dynamiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const AND: Prisma.AddressWhereInput[] = [];

		// Parcours des filtres fournis dans la requête
		Object.entries(params.filters).forEach(([key, value]) => {
			if (value === undefined || value === null) return;

			switch (key) {
				case "addressType":
					// Filtrage par type d'adresse (unique ou multiple)
					if (Array.isArray(value) && value.length > 0) {
						AND.push({
							addressType: { in: value as AddressType[] },
						});
					} else if (typeof value === "string") {
						AND.push({
							addressType: value as AddressType,
						});
					}
					break;

				case "isDefault":
					// Filtrage par adresse par défaut
					if (typeof value === "boolean") {
						AND.push({
							isDefault: value,
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
			(whereClause.AND as Prisma.AddressWhereInput[]).push(...AND);
		}
	}

	return whereClause;
}
