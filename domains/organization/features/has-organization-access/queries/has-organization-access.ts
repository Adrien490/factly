"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { checkOrganizationAccess } from "./check-organization-access";

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
		return false;
	}

	// Appel à la fonction interne mise en cache
	return checkOrganizationAccess(organizationId, session.user.id);
}
