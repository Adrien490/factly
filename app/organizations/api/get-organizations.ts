"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import getOrganizationsSchema, {
	GetOrganizationsParams,
} from "../schemas/get-organizations-schema";

const DEFAULT_SELECT = {
	id: true,
	name: true,
	email: true,
	phone: true,
	website: true,
	address: true,
	city: true,
	zipCode: true,
	country: true,
	siren: true,
	vatNumber: true,
	siret: true,
	vatOptionDebits: true,
	legalForm: true,
	rcsNumber: true,
	capital: true,
	createdAt: true,
	updatedAt: true,
	memberships: {
		select: {
			userId: true,
		},
	},
} satisfies Prisma.OrganizationSelect;

export default async function getOrganizations(params: GetOrganizationsParams) {
	try {
		// 1. Vérification de l'authentification
		const session = await auth();
		if (!session?.user?.id) {
			throw new Error("UNAUTHORIZED");
		}

		// 2. Validation des paramètres
		const validation = getOrganizationsSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Paramètres invalides");
		}

		const validatedParams = validation.data;

		// 3. Construction de la requête
		const where: Prisma.OrganizationWhereInput = {
			memberships: {
				some: {
					userId: session.user.id,
				},
			},
		};

		// 4. Récupération des données avec cache
		const getData = async () => {
			const organizations = await db.organization.findMany({
				where,
				select: DEFAULT_SELECT,
				orderBy: { [validatedParams.sortBy]: validatedParams.sortOrder },
			});

			return organizations;
		};

		return await unstable_cache(
			getData,
			[
				"organizations",
				`user-${session.user.id}`,
				JSON.stringify({
					sortBy: validatedParams.sortBy,
					sortOrder: validatedParams.sortOrder,
				}),
			],
			{
				revalidate: 60, // 1 minute
				tags: ["organizations", `user-${session.user.id}-organizations`],
			}
		)();
	} catch (error) {
		console.error("[GET_ORGANIZATIONS]", {
			error,
			timestamp: new Date().toISOString(),
			headers: headers(),
		});
		throw error;
	}
}
