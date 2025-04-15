"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import { headers } from "next/headers";

/**
 * Vérifie si l'utilisateur authentifié a accès à une organisation spécifique
 * Un utilisateur a accès s'il est membre de l'organisation (relation dans la table Member)
 *
 * @param organizationId L'identifiant de l'organisation à vérifier
 * @returns true si l'utilisateur a accès, false sinon
 */
export async function hasOrganizationAccess(organizationId: string) {
	// Vérification de l'authentification
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user?.id) {
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
				userId: session.user.id,
				organizationId,
			},
		},
		select: { id: true },
	});

	if (!membership) {
		console.log(
			`[HAS_ORGANIZATION_ACCESS] L'utilisateur ${session.user.id} n'est pas membre de l'organisation ${organizationId}`
		);
		return false;
	}

	return true;
}
