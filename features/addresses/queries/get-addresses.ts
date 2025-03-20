"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/lib/db";
import { AddressType, Prisma } from "@prisma/client";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";
import getAddressesSchema, {
	GetAddressesParams,
} from "../schemas/get-addresses-schema";

// Constants
const MAX_RESULTS_PER_PAGE = 100;
const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les adresses
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
const DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	addressType: true,
	line1: true,
	line2: true,
	postalCode: true,
	city: true,
	region: true,
	country: true,
	isDefault: true,
	latitude: true,
	longitude: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relation client avec informations minimales
	client: {
		select: {
			id: true,
			name: true,
			reference: true,
			organizationId: true,
		},
	},
	clientId: true,
} as const satisfies Prisma.AddressSelect;

export type GetAddressesReturn = {
	addresses: Array<Prisma.AddressGetPayload<{ select: typeof DEFAULT_SELECT }>>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

/**
 * Construit les conditions de recherche pour les adresses
 */
const buildSearchConditions = (
	searchTerm: string
): Prisma.AddressWhereInput[] => {
	return [
		{ line1: { contains: searchTerm, mode: "insensitive" } },
		{ line2: { contains: searchTerm, mode: "insensitive" } },
		{ city: { contains: searchTerm, mode: "insensitive" } },
		{ postalCode: { contains: searchTerm, mode: "insensitive" } },
		{ region: { contains: searchTerm, mode: "insensitive" } },
		{ country: { contains: searchTerm, mode: "insensitive" } },
		// Recherche par informations client
		{
			client: {
				name: { contains: searchTerm, mode: "insensitive" },
			},
		},
		{
			client: {
				reference: { contains: searchTerm, mode: "insensitive" },
			},
		},
	];
};

/**
 * Construit les conditions de filtrage pour les adresses
 */
const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.AddressWhereInput[] => {
	const conditions: Prisma.AddressWhereInput[] = [];

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "addressType":
				if (
					typeof value === "string" &&
					Object.values(AddressType).includes(value as AddressType)
				) {
					conditions.push({ addressType: value as AddressType });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les types d'adresse
					conditions.push({
						addressType: {
							in: value.filter(
								(v): v is AddressType =>
									typeof v === "string" &&
									Object.values(AddressType).includes(v as AddressType)
							),
						},
					});
				}
				break;
			case "city":
				if (typeof value === "string") {
					conditions.push({
						city: { contains: value, mode: "insensitive" },
					});
				}
				break;
			case "postalCode":
				if (typeof value === "string") {
					conditions.push({
						postalCode: { equals: value },
					});
				}
				break;
			case "country":
				if (typeof value === "string") {
					conditions.push({
						country: { equals: value },
					});
				}
				break;
			case "isDefault":
				if (typeof value === "boolean") {
					conditions.push({ isDefault: value });
				}
				break;
			case "clientId":
				if (typeof value === "string") {
					conditions.push({ clientId: value });
				}
				break;
		}
	});

	return conditions;
};

/**
 * Construit la clause WHERE pour la requête Prisma
 */
const buildWhereClause = (
	params: GetAddressesParams
): Prisma.AddressWhereInput => {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.AddressWhereInput = {
		client: {
			organizationId: params.organizationId,
		},
	};

	// Ajouter les conditions de recherche textuelle
	if (params.search?.trim()) {
		whereClause.OR = buildSearchConditions(params.search);
	}

	// Ajouter les filtres spécifiques
	if (params.filters && Object.keys(params.filters).length > 0) {
		const filterConditions = buildFilterConditions(params.filters);
		if (filterConditions.length > 0) {
			// Combiner avec AND existant ou créer un nouveau tableau AND
			whereClause.AND = filterConditions;
		}
	}

	return whereClause;
};

/**
 * Fonction interne cacheable qui récupère les adresses
 */
async function fetchAddresses(
	params: GetAddressesParams,
	userId: string
): Promise<GetAddressesReturn> {
	"use cache";

	// Configuration du cache
	cacheLife({ stale: 1800, revalidate: 300, expire: 7200 });

	// Tags de cache pour l'invalidation ciblée
	cacheTag(`addresses:user:${userId}:org:${params.organizationId}`);

	if (params.search) {
		cacheTag(
			`addresses:user:${userId}:org:${params.organizationId}:search:${params.search}`
		);
	}

	if (params.filters) {
		cacheTag(
			`addresses:user:${userId}:org:${
				params.organizationId
			}:filters:${JSON.stringify(params.filters)}`
		);
	}

	try {
		// Normalize pagination parameters
		const page = Math.max(1, params.page || 1);
		const perPage = Math.min(
			Math.max(1, params.perPage || DEFAULT_PER_PAGE),
			MAX_RESULTS_PER_PAGE
		);

		// Validate parameters
		const validation = getAddressesSchema.safeParse({
			...params,
			page,
			perPage,
		});

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams);

		// Get total count
		const total = await db.address.count({ where });

		// Calculate pagination parameters
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Get data
		const addresses = await db.address.findMany({
			where,
			select: DEFAULT_SELECT,
			take: perPage,
			skip,
			orderBy: [
				{ [validatedParams.sortBy]: validatedParams.sortOrder },
				{ id: validatedParams.sortOrder },
			],
		});

		return {
			addresses,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_ADDRESSES]", error);
		return {
			addresses: [],
			pagination: {
				page: 1,
				perPage: DEFAULT_PER_PAGE,
				total: 0,
				pageCount: 0,
			},
		};
	}
}

/**
 * Récupère la liste des adresses liées à une organisation
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export default async function getAddresses(
	params: GetAddressesParams
): Promise<GetAddressesReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(params.organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction cacheable
		return fetchAddresses(params, session.user.id);
	} catch (error) {
		console.error("[GET_ADDRESSES]", error);
		throw new Error("Failed to fetch addresses");
	}
}
