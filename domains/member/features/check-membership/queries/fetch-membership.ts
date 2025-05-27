import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { CHECK_MEMBERSHIP_SELECT } from "../constants";
import { CheckMembershipReturn } from "../types";

/**
 * Fonction interne cacheable qui vérifie l'appartenance d'un utilisateur
 */
export async function fetchMembership(
	userId: string
): Promise<CheckMembershipReturn> {
	"use cache";

	// Tag de cache pour l'appartenance de cet utilisateur
	cacheTag(`membership:${userId}`);
	cacheLife({
		revalidate: 60 * 5, // 5 minutes - plus court car l'appartenance peut changer
		stale: 60 * 10, // 10 minutes
		expire: 60 * 60, // 1 heure
	});

	try {
		const member = await db.member.findFirst({
			where: {
				userId: userId,
			},
			select: CHECK_MEMBERSHIP_SELECT,
		});

		return {
			isMember: !!member,
			member: member,
			memberSince: member?.createdAt,
		};
	} catch (error) {
		console.error("[FETCH_MEMBERSHIP]", error);
		// En cas d'erreur, on considère que l'utilisateur n'est pas membre
		return {
			isMember: false,
			member: null,
		};
	}
}
