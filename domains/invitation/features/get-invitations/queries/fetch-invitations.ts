"use server";

import db from "@/shared/lib/db";
import { GET_INVITATIONS_DEFAULT_SELECT } from "../constants";
import { GetInvitationsParams, GetInvitationsReturn } from "../types";
import { buildFilterConditions } from "./build-filter-conditions";

/**
 * Fonction interne cacheable qui récupère les invitations
 * @param params - Paramètres validés contenant l'organizationId, les filtres et les options de tri
 * @returns Liste des invitations filtrées pour l'organisation spécifiée
 */
export async function fetchInvitations(
	params: GetInvitationsParams
): Promise<GetInvitationsReturn> {
	try {
		// Construction des filtres additionnels
		const filterConditions = buildFilterConditions(params);

		// Récupération des invitations pour l'organisation spécifiée avec filtres
		const invitations = await db.invitation.findMany({
			where: {
				AND: filterConditions,
			},
			select: GET_INVITATIONS_DEFAULT_SELECT,
			orderBy: { [params.sortBy]: params.sortOrder },
		});

		return invitations;
	} catch (error) {
		console.error("[FETCH_INVITATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
