"use server";

import { auth } from "@/features/auth/lib/auth";
import db from "@/shared/lib/db";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// Constants

/**
 * Sélection par défaut des champs pour une organisation
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
	_count: {
		select: {
			clients: true,
			invoices: true,
			quotes: true,
			fiscalYears: true,
		},
	},
} satisfies Prisma.OrganizationSelect;

export type GetOrganizationReturn = Prisma.OrganizationGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;

/**
 * Récupère une organisation par son ID
 * @param id ID de l'organisation à récupérer
 * @returns Détails de l'organisation
 */
export async function getOrganization(
	id: string
): Promise<GetOrganizationReturn> {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Unauthorized");
		}

		// Récupération de l'organisation avec timeout
		const organization = await Promise.race([
			db.organization.findFirst({
				where: {
					id,
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
				select: DEFAULT_SELECT,
			}),
		]);

		if (!organization) {
			notFound();
		}

		return organization;
	} catch (error) {
		console.error("[GET_ORGANIZATION]", { id, error });

		// Si l'erreur est due à un problème de not found, utiliser notFound()
		if (error instanceof Error && error.message.includes("not found")) {
			notFound();
		}

		throw error instanceof Error
			? error
			: new Error("Failed to fetch organization");
	}
}
