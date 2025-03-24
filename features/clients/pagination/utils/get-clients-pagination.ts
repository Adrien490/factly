"use server";

import { auth } from "@/features/auth/lib/auth";
import { hasOrganizationAccess } from "@/features/organizations/has-access";
import { headers } from "next/headers";
import { z } from "zod";
import { countClients } from "../../count/utils";
import { getClientsPaginationSchema } from "../schemas";
import { GetClientsPaginationReturn } from "../types";
import { calculatePagination } from "./calculate-pagination";

/**
 * Récupère les informations de pagination pour les clients d'une organisation
 * @param params - Paramètres validés par getClientsPaginationSchema
 * @returns Informations de pagination
 */
export async function getClientsPagination(
	params: z.infer<typeof getClientsPaginationSchema>
): Promise<GetClientsPaginationReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(params.organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Validation des paramètres
		const validation = getClientsPaginationSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Compter le nombre total de clients
		const total = await countClients({
			organizationId: validatedParams.organizationId,
			filters: {},
		});

		// Calculer les informations de pagination
		const { pagination } = calculatePagination(
			total.count,
			validatedParams.page,
			validatedParams.perPage
		);

		return { pagination };
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
