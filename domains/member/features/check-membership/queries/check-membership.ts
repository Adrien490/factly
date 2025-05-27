"use server";

import { auth } from "@/domains/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { checkMembershipSchema } from "../schemas/check-membership-schema";
import { CheckMembershipReturn } from "../types";
import { fetchMembership } from "./fetch-membership";

/**
 * Vérifie si un utilisateur spécifique fait partie des membres
 * Nécessite une authentification et peut être utilisé par les admins
 */
export async function checkMembership(
	params: z.infer<typeof checkMembershipSchema>
): Promise<CheckMembershipReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = checkMembershipSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Si aucun userId n'est fourni, on vérifie pour l'utilisateur connecté
		const targetUserId = validatedParams.userId || session.user.id;

		// Appel à la fonction cacheable
		return await fetchMembership(targetUserId);
	} catch (error) {
		console.error("[CHECK_MEMBERSHIP]", error);
		// En cas d'erreur, on considère que l'utilisateur n'est pas membre
		return {
			isMember: false,
			member: null,
		};
	}
}
