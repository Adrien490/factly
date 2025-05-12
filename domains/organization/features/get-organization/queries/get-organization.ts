"use server";

import { auth } from "@/domains/auth";
import { id } from "date-fns/locale";
import { headers } from "next/headers";
import { fetchOrganization } from ".";
import { hasOrganizationAccess } from "../../has-organization-access";
import { getOrganizationSchema } from "../schemas";
import { GetOrganizationParams, GetOrganizationReturn } from "../types";

/**
 * Récupère une organisation par son ID
 * @param id ID de l'organisation à récupérer
 * @returns Détails de l'organisation
 */
export async function getOrganization(
	params: GetOrganizationParams
): Promise<GetOrganizationReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		const validation = getOrganizationSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}
		const { id, slug } = validation.data;
		const identifier = id ?? slug;

		if (!identifier) {
			throw new Error("Invalid parameters");
		}

		if (!hasOrganizationAccess(identifier)) {
			throw new Error("Unauthorized");
		}

		// Récupération de l'organisation avec timeout
		const organization = await fetchOrganization(
			validation.data,
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
