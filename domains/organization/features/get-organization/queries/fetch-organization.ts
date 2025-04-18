"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_ORGANIZATION_DEFAULT_SELECT } from "../constants";
import { getOrganizationSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère un client
 */
export async function fetchOrganization(
	params: z.infer<typeof getOrganizationSchema>,
	userId: string
) {
	"use cache";

	cacheTag(`organization:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24, // 24 heures
	});

	try {
		const organization = await db.organization.findFirst({
			where: {
				id: params.id,
				members: {
					some: {
						userId,
					},
				},
			},
			select: GET_ORGANIZATION_DEFAULT_SELECT,
		});

		if (!organization) {
			throw new Error("Organization not found");
		}

		return organization;
	} catch (error) {
		console.error("[FETCH_ORGANIZATION]", error);
		throw new Error("Failed to fetch organization");
	}
}
