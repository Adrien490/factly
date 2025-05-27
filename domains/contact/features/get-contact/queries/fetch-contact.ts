"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_CONTACT_DEFAULT_SELECT } from "../constants";
import { getContactSchema } from "../schemas/get-contact-schema";
import { GetContactReturn } from "../types";

/**
 * Fonction interne cacheable qui récupère un contact
 */
export async function fetchContact(
	params: z.infer<typeof getContactSchema>
): Promise<GetContactReturn> {
	"use cache";

	// Tags de cache
	cacheTag(`contacts:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24 * 7, // 7 jours
	});

	try {
		// Récupération du contact
		const contact = await db.contact.findFirst({
			where: {
				id: params.id,
			},
			select: GET_CONTACT_DEFAULT_SELECT,
		});

		if (!contact) {
			return null;
		}

		return contact;
	} catch (error) {
		console.error("[FETCH_CONTACT]", error);
		throw error;
	}
}
