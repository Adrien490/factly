"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";
import getTagSchema, { GetTagParams } from "../schemas/get-tag-schema";

/**
 * Sélection par défaut des champs pour un tag
 */
const DEFAULT_SELECT = {
	id: true,
	name: true,
	type: true,
	color: true,
	description: true,
	createdAt: true,
	updatedAt: true,
	organizationId: true,
};

export type GetTagReturn = Prisma.TagGetPayload<{
	select: typeof DEFAULT_SELECT;
}> | null;

/**
 * Fonction pour récupérer un tag spécifique
 */
export default async function getTag(
	params: GetTagParams
): Promise<GetTagReturn> {
	try {
		// Validation des paramètres
		const validationResult = getTagSchema.safeParse(params);
		if (!validationResult.success) {
			console.error("Erreur de validation:", validationResult.error);
			return null;
		}

		const { id, organizationId } = validationResult.data;

		// Récupération de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			console.error("Utilisateur non authentifié");
			return null;
		}

		// Vérification de l'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			console.error("Accès non autorisé à l'organisation");
			return null;
		}

		// Récupération du tag
		const tag = await db.tag.findFirst({
			where: {
				id,
				organizationId,
			},
			select: DEFAULT_SELECT,
		});

		// Configuration du cache
		cacheTag(`tag:${id}`);
		cacheTag(`organization:${organizationId}:tags`);
		cacheLife({ stale: 60, revalidate: 60 }); // 60 secondes

		return tag;
	} catch (error) {
		console.error("Erreur lors de la récupération du tag:", error);
		return null;
	}
}
