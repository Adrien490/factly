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

	// Tag de base pour tous les contacts de l'organisation
	cacheTag(`organizations:${params.organizationId}:contacts:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		const contact = await db.contact.findFirst({
			where: {
				id: params.id,
				OR: [
					{
						client: {
							organizationId: params.organizationId,
							...(params.clientId && { id: params.clientId }),
						},
					},
					{
						supplier: {
							organizationId: params.organizationId,
							...(params.supplierId && { id: params.supplierId }),
						},
					},
				],
			},
			select: GET_CONTACT_DEFAULT_SELECT,
		});

		if (!contact) {
			return null;
		}

		return contact;
	} catch (error) {
		console.error("[FETCH_CONTACT]", error);
		throw new Error("Failed to fetch contact");
	}
}
