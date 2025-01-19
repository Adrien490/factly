"use server";

import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import getOrganizationsSchema, {
	GetOrganizationsParams,
} from "../schemas/get-organizations-schema";

// Constants
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;

// Types
const DEFAULT_SELECT = {
	id: true,
	name: true,
	logo: true,
	siren: true,
	siret: true,
	vatNumber: true,
	vatOptionDebits: true,
	legalForm: true,
	rcsNumber: true,
	capital: true,
	address: true,
	city: true,
	zipCode: true,
	country: true,
	phone: true,
	email: true,
	website: true,
	createdAt: true,
	updatedAt: true,
	userId: true,
} satisfies Prisma.OrganizationSelect;

export type GetOrganizationsReturn = Array<
	Prisma.OrganizationGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

// Helpers
const buildWhereClause = (
	params: GetOrganizationsParams,
	userId: string
): Prisma.OrganizationWhereInput => {
	const baseWhere: Prisma.OrganizationWhereInput = {
		members: {
			some: {
				userId,
			},
		},
	};

	if (!params.search) {
		return baseWhere;
	}

	const searchTerm = params.search.trim().toLowerCase();
	return {
		AND: [
			baseWhere,
			{
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ siren: { contains: searchTerm, mode: "insensitive" } },
					{ siret: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		],
	};
};

const buildCacheKey = (params: GetOrganizationsParams, userId: string) => {
	return [
		`organizations:user:${userId}`,
		params.search && `search:${params.search}`,
		params.sortBy &&
			params.sortOrder &&
			`sort:${params.sortBy}:${params.sortOrder}`,
		`timestamp:${Date.now()}`,
	]
		.filter(Boolean)
		.join(":");
};

const buildCacheTags = (userId: string) => {
	return [
		"organizations:list",
		`organizations:user:${userId}`,
		`organizations:user:${userId}:list`,
	].filter(Boolean);
};

export default async function getOrganizations(
	params: GetOrganizationsParams
): Promise<GetOrganizationsReturn> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			notFound();
		}

		// Validate parameters
		const validation = getOrganizationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, session.user.id);
		const cacheKey = buildCacheKey(validatedParams, session.user.id);
		const cacheTags = buildCacheTags(session.user.id);

		const getData = async () => {
			// Get data with timeout
			const organizations = await Promise.race([
				db.organization.findMany({
					where,
					select: DEFAULT_SELECT,
					orderBy:
						validatedParams.sortBy && validatedParams.sortOrder
							? [
									{ [validatedParams.sortBy]: validatedParams.sortOrder },
									{ id: validatedParams.sortOrder },
							  ]
							: [{ createdAt: "desc" }, { id: "desc" }],
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);

			return organizations;
		};

		return await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: cacheTags,
		})();
	} catch (error) {
		console.error("[GET_ORGANIZATIONS]", error);
		return [];
	}
}
