"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organizations/has-access";
import { headers } from "next/headers";
import { z } from "zod";
import { getClientSchema } from "../schemas";
import { fetchClient } from "./fetch-client";

/**
 * Récupère les détails d'un client spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getClient(params: z.infer<typeof getClientSchema>) {
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
