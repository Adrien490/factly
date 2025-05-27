"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { getContactsSchema } from "../schemas/get-contacts-schema";
import { GetContactsReturn } from "../types";
import { fetchContacts } from "./fetch-contacts";

/**
 * Récupère la liste des contacts d'un client
 * @param params - Paramètres validés par getContactsSchema
 * @returns Liste des contacts
 */
export async function getContacts(
	params: z.infer<typeof getContactsSchema>
): Promise<GetContactsReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		const validation = getContactsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		return fetchContacts(validatedParams);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
