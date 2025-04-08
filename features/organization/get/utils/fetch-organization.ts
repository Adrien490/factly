import db from "@/shared/lib/db";
import { z } from "zod";
import { DEFAULT_SELECT } from "../constants";
import { getOrganizationSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère un client
 */
export async function fetchOrganization(
	params: z.infer<typeof getOrganizationSchema>,
	userId: string
) {
	console.log("fetchOrganization", params, userId);

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
			select: DEFAULT_SELECT,
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
