"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { CheckMembershipReturn } from "../types";
import { fetchMembership } from "./fetch-membership";

/**
 * Vérifie si l'utilisateur connecté fait partie des membres
 * Utilise la session pour récupérer l'ID utilisateur
 */
export async function checkOwnMembership(): Promise<CheckMembershipReturn> {
	try {
		// Récupération de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			// Si pas de session, l'utilisateur n'est pas membre
			return {
				isMember: false,
				member: null,
			};
		}

		// Appel à la fonction cacheable
		return await fetchMembership(session.user.id);
	} catch (error) {
		console.error("[CHECK_OWN_MEMBERSHIP]", error);
		// En cas d'erreur, on considère que l'utilisateur n'est pas membre
		return {
			isMember: false,
			member: null,
		};
	}
}
