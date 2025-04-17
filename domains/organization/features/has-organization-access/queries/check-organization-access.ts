import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

/**
 * Fonction interne qui vérifie l'accès à une organisation
 * Cette fonction est mise en cache et ne doit pas utiliser headers()
 */
export async function checkOrganizationAccess(
	organizationId: string,
	userId: string
) {
	"use cache";

	// Tag de cache pour cette vérification spécifique
	cacheTag(`has-organization-access:${organizationId}:${userId}`);
	cacheLife({
		revalidate: 60 * 60 * 24, // 24 heures
		stale: 60 * 60 * 24, // 24 heures
		expire: 60 * 60 * 24, // 24 heures
	});

	if (!userId) {
		console.log("[HAS_ORGANIZATION_ACCESS] Aucun utilisateur authentifié");
		return false;
	}

	// Vérification que l'organisation existe
	const organization = await db.organization.findUnique({
		where: { id: organizationId },
		select: { id: true },
	});

	if (!organization) {
		return false;
	}

	// Vérification que l'utilisateur est membre de l'organisation
	const membership = await db.member.findUnique({
		where: {
			userId_organizationId: {
				userId,
				organizationId,
			},
		},
		select: { id: true },
	});

	if (!membership) {
		console.log(
			`[HAS_ORGANIZATION_ACCESS] L'utilisateur ${userId} n'est pas membre de l'organisation ${organizationId}`
		);
		return false;
	}

	return true;
}
