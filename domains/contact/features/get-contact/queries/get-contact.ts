"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization/features";
import { headers } from "next/headers";
import { z } from "zod";
import { getContactSchema } from "../schemas/get-contact-schema";
import { GetContactReturn } from "../types";
import { fetchContact } from "./fetch-contact";

/**
 * Récupère les détails d'un contact spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getContact(
	params: z.infer<typeof getContactSchema>
): Promise<GetContactReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = getContactSchema.safeParse(params);
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
		return fetchContact(validatedParams);
	} catch (error) {
		console.error("[GET_CONTACT]", error);
		throw error;
	}
}
