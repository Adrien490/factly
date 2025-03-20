"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/lib/db";
import {
	ClientPriority,
	ClientStatus,
	ClientType,
	Prisma,
} from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";
import {
	default as GetClientsSchema,
	default as getClientsSchema,
} from "../schemas/get-clients-schema";

// Constants
const MAX_RESULTS_PER_PAGE = 100;
const DEFAULT_PER_PAGE = 10;

/**
 * Sélection par défaut des champs pour les clients
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
const DEFAULT_SELECT = {
	// Identifiants et informations de base
	organizationId: true,
	id: true,
	reference: true,
	name: true,
	email: true,
	phone: true,
	website: true,
	clientType: true,
	status: true,
	priority: true,
	// Informations fiscales
	siren: true,
	siret: true,
	vatNumber: true,

	// Métadonnées
	userId: true,
	createdAt: true,
	updatedAt: true,

	// Relations avec sélections optimisées
	addresses: {
		select: {
			id: true,
			addressType: true,
			line1: true,
			line2: true,
			postalCode: true,
			city: true,
			country: true,
			latitude: true,
			longitude: true,
			isDefault: true,
		},
		where: {
			isDefault: true,
		},
	},
} as const satisfies Prisma.ClientSelect;

export type GetClientsReturn = {
	clients: Array<Prisma.ClientGetPayload<{ select: typeof DEFAULT_SELECT }>>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

/**
 * Construit les conditions de recherche pour les clients
 */
const buildSearchConditions = (
	searchTerm: string
): Prisma.ClientWhereInput[] => {
	return [
		{ name: { contains: searchTerm, mode: "insensitive" } },
		{ reference: { contains: searchTerm, mode: "insensitive" } },
		{ email: { contains: searchTerm, mode: "insensitive" } },
		{ siren: { contains: searchTerm, mode: "insensitive" } },
		{ siret: { contains: searchTerm, mode: "insensitive" } },
		{ phone: { contains: searchTerm, mode: "insensitive" } },
		{
			addresses: {
				some: { city: { contains: searchTerm, mode: "insensitive" } },
			},
		},
		{
			addresses: {
				some: { postalCode: { contains: searchTerm, mode: "insensitive" } },
			},
		},
	];
};

/**
 * Construit les conditions de filtrage pour les clients
 */
const buildFilterConditions = (
	filters: Record<string, unknown>
): Prisma.ClientWhereInput[] => {
	const conditions: Prisma.ClientWhereInput[] = [];

	Object.entries(filters).forEach(([key, value]) => {
		if (!value) return;

		switch (key) {
			case "status":
				if (
					typeof value === "string" &&
					Object.values(ClientStatus).includes(value as ClientStatus)
				) {
					conditions.push({ status: value as ClientStatus });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les statuts
					conditions.push({
						status: {
							in: value.filter(
								(v): v is ClientStatus =>
									typeof v === "string" &&
									Object.values(ClientStatus).includes(v as ClientStatus)
							),
						},
					});
				}
				break;
			case "clientType":
				if (
					typeof value === "string" &&
					Object.values(ClientType).includes(value as ClientType)
				) {
					conditions.push({ clientType: value as ClientType });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les types de client
					conditions.push({
						clientType: {
							in: value.filter(
								(v): v is ClientType =>
									typeof v === "string" &&
									Object.values(ClientType).includes(v as ClientType)
							),
						},
					});
				}
				break;
			case "priority":
				if (
					typeof value === "string" &&
					Object.values(ClientPriority).includes(value as ClientPriority)
				) {
					conditions.push({ priority: value as ClientPriority });
				} else if (Array.isArray(value) && value.length > 0) {
					// Gestion de la sélection multiple pour les priorités
					const validPriorities = value.filter(
						(v): v is ClientPriority =>
							typeof v === "string" &&
							Object.values(ClientPriority).includes(v as ClientPriority)
					);

					if (validPriorities.length > 0) {
						conditions.push({ priority: { in: validPriorities } });
					}
				}
				break;
			case "city":
				if (typeof value === "string") {
					conditions.push({
						addresses: {
							some: { city: { contains: value, mode: "insensitive" } },
						},
					});
				}
				break;
			case "postalCode":
				if (typeof value === "string") {
					conditions.push({
						addresses: { some: { postalCode: { equals: value } } },
					});
				}
				break;
		}
	});

	return conditions;
};

/**
 * Construit la clause WHERE pour la requête Prisma
 * Utilise une approche plus simple et directe pour assembler les conditions
 */
const buildWhereClause = (
	params: z.infer<typeof GetClientsSchema>
): Prisma.ClientWhereInput => {
	// Condition de base qui doit toujours être respectée
	const whereClause: Prisma.ClientWhereInput = {
		organizationId: params.organizationId,
	};

	// Ajouter le statut s'il est spécifié (rétrocompatibilité)

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
 * Fonction interne cacheable qui récupère les clients
 */
async function fetchClients(
	params: z.infer<typeof GetClientsSchema>,
	userId: string
): Promise<GetClientsReturn> {
	console.log("[FETCH_CLIENTS]", userId);
	/*"use cache";

	// Configuration du cache
	// - stale: 30 minutes avant que les données soient considérées obsolètes
	// - revalidate: 5 minutes entre les tentatives de revalidation en arrière-plan
	// - expire: 2 heures maximum avant l'expiration forcée des données
	// Ces valeurs sont optimisées pour:
	// - Données fréquemment consultées mais peu modifiées
	// - Équilibre entre fraîcheur et performance
	cacheLife({ stale: 1800, revalidate: 300, expire: 7200 });

	// Tags de cache pour l'invalidation ciblée
	// Tag principal: toutes les requêtes pour cette organisation et cet utilisateur
	cacheTag(`clients:user:${userId}:org:${params.organizationId}`);

	// Tags spécifiques pour des invalidations plus précises

	if (params.search) {
		// Les requêtes de recherche ont généralement besoin d'être plus fraîches
		// car elles sont souvent utilisées pour des recherches ponctuelles
		cacheTag(
			`clients:user:${userId}:org:${params.organizationId}:search:${params.search}`
		);
	}

	if (params.filters) {
		cacheTag(
			`clients:user:${userId}:org:${
				params.organizationId
			}:filters:${JSON.stringify(params.filters)}`
		);
	}
	*/

	try {
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
		const where = buildWhereClause(validatedParams);

		// Get total count
		const total = await db.client.count({ where });

		// Calculate pagination parameters
		const totalPages = Math.ceil(total / perPage);
		const currentPage = Math.min(page, totalPages || 1);
		const skip = (currentPage - 1) * perPage;

		// Get data
		const clients = await db.client.findMany({
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
			clients,
			pagination: {
				page: currentPage,
				perPage,
				total,
				pageCount: totalPages,
			},
		};
	} catch (error) {
		console.error("[FETCH_CLIENTS]", error);
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

/**
 * Récupère la liste des clients d'une organisation
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export default async function getClients(
	params: z.infer<typeof GetClientsSchema>
): Promise<GetClientsReturn> {
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
		return fetchClients(params, session.user.id);
	} catch (error) {
		console.error("[GET_CLIENTS]", error);
		throw new Error("Failed to fetch clients");
	}
}
