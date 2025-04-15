import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	GET_CLIENTS_DEFAULT_SELECT,
	MAX_RESULTS_PER_PAGE,
} from "../constants";
import { getClientsSchema } from "../schemas";
import { GetClientsReturn } from "../types";
import { buildWhereClause } from "./build-where-claude";

/**
 * Fonction interne qui récupère les clients
 */
export async function fetchClients(
	params: z.infer<typeof getClientsSchema>,
	userId: string
): Promise<GetClientsReturn> {
	console.log("fetchClients", userId);
	try {
		// Normalize pagination parameters
		const page = Math.max(1, Number(params.page) || 1);
		const perPage = Math.min(
			Math.max(1, Number(params.perPage) || DEFAULT_PER_PAGE),
			MAX_RESULTS_PER_PAGE
		);

		// Validate parameters

		const where = buildWhereClause(params);

		// Get total count with performance tracking
		const total = await db.client.count({ where });

		// Calculate pagination parameters
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Ensure sort order is valid
		const sortOrder = (params.sortOrder as Prisma.SortOrder) || "asc";

		// Get data with performance tracking
		const clients = await db.client.findMany({
			where,
			select: GET_CLIENTS_DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [
				{
					[String(params.sortBy) || "name"]: sortOrder,
				},
				{ id: sortOrder }, // Toujours ajouter un tri secondaire pour garantir la cohérence
			],
		});

		// Transforming clients to match expected return type
		const clientsWithAddresses = clients.map((client) => ({
			...client,
			addresses: [], // Ajouter la propriété 'addresses' requise
		}));

		return {
			clients: clientsWithAddresses,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch {
		return {
			clients: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
