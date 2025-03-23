import db from "@/shared/lib/db";
import { z } from "zod";
import { DEFAULT_SELECT } from "../constants";
import { getClientSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère un client
 */
export async function fetchClient(
	params: z.infer<typeof getClientSchema>,
	userId: string
) {
	console.log("fetchClient", params, userId);

	try {
		const client = await db.client.findFirst({
			where: {
				id: params.id,
				organizationId: params.organizationId,
			},
			select: DEFAULT_SELECT,
		});

		if (!client) {
			throw new Error("Client not found");
		}

		return client;
	} catch (error) {
		console.error("[FETCH_CLIENT]", error);
		throw new Error("Failed to fetch client");
	}
}
