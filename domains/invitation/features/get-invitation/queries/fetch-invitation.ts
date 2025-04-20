"use server";

import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_INVITATION_DEFAULT_SELECT } from "../constants";
import { getInvitationSchema } from "../schemas";
import { GetInvitationReturn } from "../types";
/**
 * Récupère une invitation par ID avec cache
 */
export async function fetchInvitation(
	params: z.infer<typeof getInvitationSchema>
): Promise<GetInvitationReturn> {
	"use cache";

	// Tags de cache
	cacheTag(`organization:${params.organizationId}:invitation:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24 * 7, // 7 jours
	});

	try {
		// Récupération de l'invitation
		const invitation = await db.invitation.findFirst({
			where: {
				id: params.id,
				organizationId: params.organizationId,
			},
			select: GET_INVITATION_DEFAULT_SELECT,
		});

		if (!invitation) {
			throw new Error("Invitation non trouvée");
		}

		return invitation;
	} catch (error) {
		console.error("[FETCH_INVITATION]", error);
		throw error;
	}
}
