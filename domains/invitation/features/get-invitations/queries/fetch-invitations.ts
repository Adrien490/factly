"use server";

import db from "@/shared/lib/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
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
	"use cache";

	// Tag de base pour toutes les invitations de l'organisation
	cacheTag(`organization:${params.organizationId}:invitations`);

	// Tag pour le tri - toujours présent car les valeurs par défaut sont définies
	cacheTag(
		`organization:${params.organizationId}:invitations:sort:${params.sortBy}:${params.sortOrder}`
	);

	// Tags pour les filtres
	if (params.status) {
		const statusValue = Array.isArray(params.status)
			? params.status.join(",")
			: params.status;
		cacheTag(
			`organization:${params.organizationId}:invitations:status:${statusValue}`
		);
	}

	if (params.expiresAt) {
		cacheTag(
			`organization:${params.organizationId}:invitations:expiresAt:${params.expiresAt}`
		);
	}

	if (params.email) {
		cacheTag(
			`organization:${params.organizationId}:invitations:email:${params.email}`
		);
	}

	if (params.userId) {
		cacheTag(
			`organization:${params.organizationId}:invitations:userId:${params.userId}`
		);
	}

	try {
		// Construction des filtres additionnels
		const filterConditions = buildFilterConditions(params);

		// Récupération des invitations pour l'organisation spécifiée avec filtres
		const invitations = await db.invitation.findMany({
			where: {
				organizationId: params.organizationId,
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
