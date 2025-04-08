import db from "@/shared/lib/db";
import { z } from "zod";
import { countClientsSchema } from "../schemas";
import { CountClientsReturn } from "../types";
import { buildWhereClause } from "./build-where-clause";

/**
 * Fonction interne qui compte les clients
 */
export async function fetchCount(
	params: z.infer<typeof countClientsSchema>
): Promise<CountClientsReturn> {
	try {
		// Validation des paramètres
		const validation = countClientsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);

		// Compter le nombre de clients
		const count = await db.client.count({ where });

		return { count };
	} catch (error) {
		console.error("[COUNT_CLIENTS]", error);
		return { count: 0 };
	}
}
