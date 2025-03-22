"use server";

import { auth } from "@/features/auth/lib/auth";
import getOrganizationsSchema, {
	GetOrganizationsParams,
} from "@/features/organizations/schemas/get-organizations-schema";
import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from "next/cache";
import { headers } from "next/headers";

/**
 * Sélection par défaut des champs pour les organisations
 * Optimisée pour correspondre exactement au schéma Prisma et aux besoins de l'interface
 */
const DEFAULT_SELECT = {
	// Identifiants et informations de base
	id: true,
	name: true,
	legalName: true,
	logoUrl: true,
	legalForm: true,

	// Informations fiscales
	siren: true,
	siret: true,
	vatNumber: true,
	intracomVatNumber: true,

	// Informations financières
	capitalAmount: true,

	// Informations de contact
	email: true,
	phone: true,
	website: true,

	// Adresse complète
	addressLine1: true,
	addressLine2: true,
	city: true,
	postalCode: true,
	region: true,
	country: true,

	// Paramètres TVA
	vatMethod: true,

	// Métadonnées
	createdAt: true,
	updatedAt: true,

	// Relations
	members: {
		select: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	},

	// Statistiques importantes
	/*_count: {
		select: {
			clients: true,
			invoices: true,
			quotes: true,
			fiscalYears: true,
		},
	},*/
} satisfies Prisma.OrganizationSelect;

export type GetOrganizationsReturn = Array<
	Prisma.OrganizationGetPayload<{ select: typeof DEFAULT_SELECT }>
>;

/**
 * Construit la clause WHERE pour les organisations
 * @param params Paramètres de recherche et filtrage
 * @param userId ID de l'utilisateur actuel
 * @returns Clause WHERE pour Prisma
 */
const buildWhereClause = (
	params: GetOrganizationsParams,
	userId: string
): Prisma.OrganizationWhereInput => {
	// Clause de base: récupère seulement les organisations dont l'utilisateur est membre
	const baseWhere: Prisma.OrganizationWhereInput = {
		members: {
			some: {
				userId,
			},
		},
	};

	// Si pas de recherche, retourne la clause de base
	if (!params.search) {
		return baseWhere;
	}

	// Sinon, ajoute les conditions de recherche
	const searchTerm = params.search.trim().toLowerCase();
	return {
		AND: [
			baseWhere,
			{
				OR: [
					{ name: { contains: searchTerm, mode: "insensitive" } },
					{ legalName: { contains: searchTerm, mode: "insensitive" } },
					{ siren: { contains: searchTerm, mode: "insensitive" } },
					{ siret: { contains: searchTerm, mode: "insensitive" } },
					{ vatNumber: { contains: searchTerm, mode: "insensitive" } },
					{ email: { contains: searchTerm, mode: "insensitive" } },
					{ city: { contains: searchTerm, mode: "insensitive" } },
				],
			},
		],
	};
};

/**
 * Fonction interne cacheable qui récupère les organisations
 * Prend directement l'ID utilisateur au lieu de l'extraire des headers
 */
async function fetchOrganizations(
	params: GetOrganizationsParams,
	userId: string
): Promise<GetOrganizationsReturn> {
	"use cache";

	// Configuration du cache et tags pour cette requête
	cacheLife({ stale: 1800, revalidate: 300, expire: 7200 });

	cacheTag(`organizations:user:${userId}`);

	if (params.search) {
		cacheTag(
			`organizations:user:${userId}:search:${params.search.toLowerCase()}`
		);
	}

	if (params.sortBy) {
		cacheTag(
			`organizations:user:${userId}:sort:${params.sortBy}-${params.sortOrder}`
		);
	}

	try {
		// Validation des paramètres
		const validation = getOrganizationsSchema.safeParse(params);

		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;
		const where = buildWhereClause(validatedParams, userId);

		// Récupération des organisations
		const organizations = await db.organization.findMany({
			where,
			select: DEFAULT_SELECT,
			orderBy: { [validatedParams.sortBy]: validatedParams.sortOrder },
		});

		return organizations;
	} catch (error) {
		console.error("[FETCH_ORGANIZATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}

/**
 * Récupère la liste des organisations de l'utilisateur connecté
 * Gère la partie authentification et appelle la fonction cacheable
 * @param params Paramètres de recherche et tri
 * @returns Liste des organisations
 */
export default async function getOrganizations(
	params: GetOrganizationsParams
): Promise<GetOrganizationsReturn> {
	try {
		// Vérification de l'authentification (partie non-cacheable)
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		// Appel à la fonction cacheable avec l'ID utilisateur
		return fetchOrganizations(params, session.user.id);
	} catch (error) {
		console.error("[GET_ORGANIZATIONS]", error);
		// Retourne un tableau vide en cas d'erreur
		return [];
	}
}
