"use server";

import getClientsSchema from "@/app/dashboard/[organizationId]/clients/schemas/get-clients-schema";
import hasOrganizationAccess from "@/app/organizations/api/has-organization-access";
import { PagePagination } from "@/components/page-pagination";
import { auth } from "@/lib/auth";
import db, { CACHE_TIMES, DB_TIMEOUTS } from "@/lib/db";
import { Civility, ClientStatus, ClientType, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

// Constants
const MAX_RESULTS_PER_PAGE = 100;
const CACHE_REVALIDATION_TIME = CACHE_TIMES.MEDIUM;
const DB_TIMEOUT = DB_TIMEOUTS.MEDIUM;
const DEFAULT_PER_PAGE = 10;

// Types
const DEFAULT_SELECT = {
	id: true,
	reference: true,
	name: true,
	email: true,
	phone: true,
	clientType: true,
	siren: true,
	siret: true,
	vatNumber: true,
	legalForm: true,
	civility: true,
	website: true,
	organizationId: true,
	status: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
	addresses: true,
} as const satisfies Prisma.ClientSelect;

export type GetClientsReturn = {
	clients: Array<Prisma.ClientGetPayload<{ select: typeof DEFAULT_SELECT }>>;
	pagination: PagePagination;
};

// Helpers
const normalizeSearchTerm = (term: string) => {
	const normalized = term.trim().toLowerCase();
	return {
		original: normalized,
		withoutAccents: normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
	};
};

const buildSearchConditions = (
	searchTerm: string
): Prisma.ClientWhereInput[] => {
	const { original, withoutAccents } = normalizeSearchTerm(searchTerm);
	return [
		{
			name: {
				contains: original,
				mode: "insensitive" as Prisma.QueryMode,
			},
		},
		{
			name: {
				contains: withoutAccents,
				mode: "insensitive" as Prisma.QueryMode,
			},
		},
		{
			reference: {
				contains: original,
				mode: "insensitive" as Prisma.QueryMode,
			},
		},
		{
			email: {
				contains: original,
				mode: "insensitive" as Prisma.QueryMode,
			},
		},
		{
			siren: {
				contains: original,
				mode: "insensitive" as Prisma.QueryMode,
			},
		},
	];
};

const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.ClientWhereInput[] => {
	const conditions: Prisma.ClientWhereInput[] = [];

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (Object.values(ClientStatus).includes(value as ClientStatus)) {
					conditions.push({ status: value as ClientStatus });
				}
				break;
			case "clientType":
				if (Object.values(ClientType).includes(value as ClientType)) {
					conditions.push({ clientType: value as ClientType });
				}
				break;
			case "civility":
				if (Object.values(Civility).includes(value as Civility)) {
					conditions.push({ civility: value as Civility });
				}
				break;
			case "zipCode":
				if (typeof value === "string") {
					conditions.push({
						addresses: { some: { zipCode: { equals: value } } },
					});
				}
				break;
		}
	});

	return conditions;
};

const buildWhereClause = (
	params: z.infer<typeof getClientsSchema>
): Prisma.ClientWhereInput => {
	const baseWhere: Prisma.ClientWhereInput = {
		organizationId: params.organizationId,
		...(params.status && { status: params.status }),
	};

	if (!params.search && !params.filters) {
		return baseWhere;
	}

	const conditions: Prisma.ClientWhereInput[] = [baseWhere];

	if (params.search?.trim()) {
		conditions.push({ OR: buildSearchConditions(params.search) });
	}

	if (params.filters) {
		const filterConditions = buildFilterConditions(params.filters);
		if (filterConditions.length > 0) {
			conditions.push({ AND: filterConditions });
		}
	}

	return conditions.length > 1 ? { AND: conditions } : baseWhere;
};

const buildCacheKey = (
	params: z.infer<typeof getClientsSchema>,
	page: number,
	perPage: number
) => {
	return [
		`clients:org:${params.organizationId}`,
		`page:${page}`,
		`perPage:${perPage}`,
		params.status && `status:${params.status}`,
		params.search && `search:${params.search}`,
		params.filters && `filters:${JSON.stringify(params.filters)}`,
		`sort:${params.sortBy}:${params.sortOrder}`,
	]
		.filter(Boolean)
		.join(":");
};

const buildCacheTags = (params: z.infer<typeof getClientsSchema>) => {
	return [
		`clients:org:${params.organizationId}`,
		params.status && `clients:org:${params.organizationId}:${params.status}`,
		"clients:list",
	].filter((tag): tag is string => Boolean(tag));
};

export default async function getClients(
	params: z.infer<typeof getClientsSchema>
): Promise<GetClientsReturn> {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		if (!session?.user?.id) {
			redirect("/login");
		}

		// Normalize pagination parameters
		const page = Math.max(1, params.page || 1);
		const perPage = Math.min(
			Math.max(1, params.perPage || DEFAULT_PER_PAGE),
			MAX_RESULTS_PER_PAGE
		);

		// Validate parameters
		const validation = getClientsSchema.safeParse({
			...params,
			page,
			perPage,
		});

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Check access rights
		const hasAccess = await Promise.race([
			hasOrganizationAccess(validatedParams.organizationId),
			new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error("Access check timeout")), DB_TIMEOUT)
			),
		]);

		if (!hasAccess) {
			notFound();
		}

		const where = buildWhereClause(validatedParams);
		const cacheKey = buildCacheKey(validatedParams, page, perPage);
		const cacheTags = buildCacheTags(validatedParams);

		const getData = async () => {
			// Get total count with timeout
			const total = await Promise.race([
				db.client.count({ where }),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Count timeout")), DB_TIMEOUT)
				),
			]);

			// Calculate pagination parameters
			const totalPages = Math.ceil(total / perPage);
			const currentPage = Math.min(page, totalPages || 1);
			const skip = (currentPage - 1) * perPage;

			// Get data with timeout
			const clients = await Promise.race([
				db.client.findMany({
					where,
					select: DEFAULT_SELECT,
					take: perPage,
					skip,
					orderBy: [
						{ [validatedParams.sortBy]: validatedParams.sortOrder },
						{ id: validatedParams.sortOrder },
					],
				}),
				new Promise<never>((_, reject) =>
					setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT)
				),
			]);

			return {
				clients,
				pagination: {
					page: currentPage,
					perPage,
					total,
					pageCount: totalPages,
				},
			};
		};

		return await unstable_cache(getData, [cacheKey], {
			revalidate: CACHE_REVALIDATION_TIME,
			tags: cacheTags,
		})();
	} catch (error) {
		console.error("Error in getClients:", error);
		return {
			clients: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}
