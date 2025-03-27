import db from "@/features/shared/lib/db";
import { z } from "zod";
import {
	DEFAULT_PER_PAGE,
	DEFAULT_SELECT,
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
		const page = Math.max(1, params.page || 1);
		const perPage = Math.min(
			Math.max(1, params.perPage || DEFAULT_PER_PAGE),
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

		// Get data with performance tracking
		const clients = await db.client.findMany({
			where,
			select: DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [
				{
					[params.sortBy || "name"]: params.sortOrder || "asc",
				},
				{ id: params.sortOrder || "asc" }, // Toujours ajouter un tri secondaire pour garantir la cohérence
			],
		});

		return {
			clients,
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
