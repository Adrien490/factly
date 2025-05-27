import db from "@/shared/lib/db";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { z } from "zod";
import { GET_MEMBER_DEFAULT_SELECT } from "../constants";
import { getMemberSchema } from "../schemas/get-member-schema";

/**
 * Fonction interne cacheable qui récupère un membre
 */
export async function fetchMember(params: z.infer<typeof getMemberSchema>) {
	"use cache";

	// Tag de base pour tous les membres
	cacheTag(`members:${params.id}`);
	cacheLife({
		revalidate: 60 * 60 * 24,
		stale: 60 * 60 * 24,
		expire: 60 * 60 * 24,
	});

	try {
		const member = await db.member.findFirst({
			where: {
				id: params.id,
			},
			select: GET_MEMBER_DEFAULT_SELECT,
		});

		if (!member) {
			return null;
		}

		return member;
	} catch (error) {
		console.error("[FETCH_MEMBER]", error);
		throw new Error("Failed to fetch member");
	}
}
