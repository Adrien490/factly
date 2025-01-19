"use server";

import hasOrganizationAccess from "@/app/dashboard/(with-sidebar)/organizations/server/has-organization-access";
import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";
import getClientSchema from "../schemas/get-client-schema";
// Constantes pour les limites et timeouts
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM; // 30 minutes
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM; // 10 secondes

export default async function getClient(
	params: z.infer<typeof getClientSchema>
) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			throw new Error("UNAUTHORIZED");
		}

		// 2. Validation des paramètres
		const validation = getClientSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const { id, organizationId } = validation.data;

		// 3. Vérification des accès avec timeout
		const accessPromise = hasOrganizationAccess(organizationId);
		const hasAccess = await Promise.race([
			accessPromise,
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("Timeout")), DB_TIMEOUT)
			),
		]);

		if (!hasAccess) {
			throw new Error("Vous n'avez pas accès à cette organisation");
		}

		// 4. Récupération des données avec cache
		const getData = async () => {
			const client = await db.client.findFirst({
				where: {
					id,
					organizationId,
				},
				include: {
					addresses: true,
				},
			});

			if (!client) {
				notFound();
			}

			return client;
		};

		// 5. Utilisation du cache avec clé optimisée
		return await unstable_cache(getData, [`client:${id}`], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: [`client:${id}`, `client:org:${organizationId}:${id}`],
		})();
	} catch (error) {
		throw error;
	}
}
