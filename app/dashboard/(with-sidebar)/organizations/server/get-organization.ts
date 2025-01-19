"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { Organization, Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

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
	userId: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.OrganizationSelect;

type GetOrganizationResult = Pick<Organization, keyof typeof DEFAULT_SELECT>;

/**
 * Récupère une organisation par son slug
 */
export async function getOrganization(
	id: string
): Promise<GetOrganizationResult> {
	try {
		// Vérification de la session
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session) {
			throw new Error("Vous devez être connecté pour accéder à cette page");
		}

		// Récupération de l'organisation avec cache
		const getOrganizationFromDb = async () => {
			const organization = await db.organization.findFirst({
				where: {
					id,
					members: {
						some: {
							userId: session.user.id,
						},
					},
				},
				select: DEFAULT_SELECT,
			});

			if (!organization) {
				throw new Error("Organisation non trouvée");
			}

			return organization;
		};

		return unstable_cache(
			getOrganizationFromDb,
			[`organization-${id}-${session.user.id}`],
			{
				revalidate: 60,
				tags: ["organizations"],
			}
		)();
	} catch (error) {
		console.error("[GET_ORGANIZATION_ERROR]", { id, error });
		throw error instanceof Error
			? error
			: new Error("Erreur lors de la récupération de l'organisation");
	}
}
