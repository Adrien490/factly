import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getContactsSchema } from "../schemas/get-contacts-schema";

/**
 * Construit la clause WHERE de la requête Prisma pour le filtrage des contacts
 */
export function buildWhereClause(
	params: z.infer<typeof getContactsSchema>
): Prisma.ContactWhereInput {
	// Base de la clause WHERE
	const whereClause: Prisma.ContactWhereInput = {};

	// Filtrage par client ou fournisseur
	if (params.clientId) {
		whereClause.clientId = params.clientId;
	}

	if (params.supplierId) {
		whereClause.supplierId = params.supplierId;
	}

	// Traitement de la recherche textuelle si fournie
	if (typeof params.search === "string" && params.search.trim()) {
		const searchTerm = params.search.trim();
		whereClause.OR = [
			{
				firstName: {
					contains: searchTerm,
					mode: "insensitive",
				},
			},
			{
				lastName: {
					contains: searchTerm,
					mode: "insensitive",
				},
			},
			{
				email: {
					contains: searchTerm,
					mode: "insensitive",
				},
			},
			{
				function: {
					contains: searchTerm,
					mode: "insensitive",
				},
			},
		];
	}

	return whereClause;
}
