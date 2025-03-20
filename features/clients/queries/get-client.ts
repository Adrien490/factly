"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/lib/db";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { z } from "zod";
import getClientSchema from "../schemas/get-client-schema";

/**
 * Sélection par défaut des champs pour un client
 * Optimisée pour correspondre exactement aux besoins de la vue détail
 */
const DEFAULT_SELECT = {
	id: true,
	organizationId: true,
	reference: true,
	name: true,
	email: true,
	phone: true,
	website: true,
	clientType: true,
	status: true,
	priority: true,
	siren: true,
	siret: true,
	vatNumber: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
	addresses: {
		select: {
			id: true,
			addressType: true,
			line1: true,
			line2: true,
			postalCode: true,
			city: true,
			country: true,
			latitude: true,
			longitude: true,
			isDefault: true,
		},
	},
} as const;

/**
 * Fonction interne cacheable qui récupère un client
 */
async function fetchClient(
	params: z.infer<typeof getClientSchema>,
	userId: string
) {
	"use cache";

	// Configuration du cache
	cacheLife({ stale: 1800, revalidate: 300, expire: 7200 });

	// Tags de cache pour l'invalidation ciblée
	cacheTag(`client:${params.id}`);
	cacheTag(`client:user:${userId}:org:${params.organizationId}`);
	cacheTag(`client:org:${params.organizationId}`);

	try {
		const client = await db.client.findFirst({
			where: {
				id: params.id,
				organizationId: params.organizationId,
			},
			select: DEFAULT_SELECT,
		});

		if (!client) {
			notFound();
		}

		return client;
	} catch (error) {
		console.error("[FETCH_CLIENT]", error);
		throw new Error("Failed to fetch client");
	}
}

/**
 * Récupère les détails d'un client spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export default async function getClient(
	params: z.infer<typeof getClientSchema>
) {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = getClientSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(
			validatedParams.organizationId
		);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction cacheable
		return fetchClient(validatedParams, session.user.id);
	} catch (error) {
		console.error("[GET_CLIENT]", error);
		throw error;
	}
}
