import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_CLIENT_DEFAULT_SELECT } from "../constants";
import { getClientSchema } from "../schemas/get-client-schema";

/**
 * Fonction interne cacheable qui récupère un client
 */
export async function fetchClient(params: z.infer<typeof getClientSchema>) {
	"use cache";

	// Tag de base pour tous les clients
	cacheTag(`clients:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		const client = await db.client.findFirst({
			where: {
				id: params.id,
			},
			select: GET_CLIENT_DEFAULT_SELECT,
		});

		if (!client) {
			return null;
		}

		return client;
	} catch (error) {
		console.error("[FETCH_CLIENT]", error);
		throw new Error("Failed to fetch client");
	}
}
