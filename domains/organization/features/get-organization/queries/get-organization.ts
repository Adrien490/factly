"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { fetchOrganization } from ".";
import { hasOrganizationAccess } from "../../has-organization-access";
import { getOrganizationSchema } from "../schemas";
import { GetOrganizationReturn } from "../types";

/**
 * Récupère une organisation par son ID
 * @param id ID de l'organisation à récupérer
 * @returns Détails de l'organisation
 */
export async function getOrganization(
	id: string
): Promise<GetOrganizationReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		if (!hasOrganizationAccess(id)) {
			throw new Error("Unauthorized");
		}

		const validation = getOrganizationSchema.safeParse({ id });

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Récupération de l'organisation avec timeout
		const organization = await fetchOrganization(
			validatedParams,
			session.user.id
		);

		if (!organization) {
			throw new Error("Organization not found");
		}

		return organization;
	} catch (error) {
		console.error("[GET_ORGANIZATION]", { id, error });

		// Si l'erreur est due à un problème de not found, utiliser notFound()
		if (error instanceof Error && error.message.includes("not found")) {
			throw new Error("Organization not found");
		}

		throw error instanceof Error
			? error
			: new Error("Failed to fetch organization");
	}
}
