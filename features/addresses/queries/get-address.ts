"use server";

import { auth } from "@/features/auth/lib/auth";
import hasOrganizationAccess from "@/features/organizations/queries/has-organization-access";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import getAddressSchema from "../schemas/get-address-schema";

/**
 * Sélection par défaut des champs pour une adresse
 * Optimisée pour correspondre exactement aux besoins de la vue détaillée
 */
const DEFAULT_SELECT = {
	id: true,
	addressType: true,
	line1: true,
	line2: true,
	postalCode: true,
	city: true,
	region: true,
	country: true,
	latitude: true,
	longitude: true,
	isDefault: true,
	createdAt: true,
	updatedAt: true,
	clientId: true,
	client: {
		select: {
			id: true,
			name: true,
			reference: true,
			organizationId: true,
		},
	},
} as const;

/**
 * Fonction interne cacheable qui récupère une adresse
 */
async function fetchAddress(
	params: z.infer<typeof getAddressSchema>,
	userId: string
) {
	console.log("[FETCH_ADDRESS]", userId);

	try {
		// Recherche de l'adresse avec vérification de l'appartenance à l'organisation
		const address = await db.address.findFirst({
			where: {
				id: params.id,
				client: {
					organizationId: params.organizationId,
				},
			},
			select: DEFAULT_SELECT,
		});

		if (!address) {
			throw new Error("Address not found");
		}

		return address;
	} catch (error) {
		console.error("[FETCH_ADDRESS]", error);
		throw new Error("Failed to fetch address");
	}
}

/**
 * Récupère les détails d'une adresse spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export default async function getAddress(
	params: z.infer<typeof getAddressSchema>
) {
	try {
		// Vérification de l'authentification
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user?.id) {
			throw new Error("Unauthorized");
		}

		// Validation des paramètres
		const validation = getAddressSchema.safeParse(params);
		if (!validation.success) {
			throw new Error("Invalid parameters");
		}

		const validatedParams = validation.data;

		// Vérification des droits d'accès à l'organisation
		const hasAccess = await hasOrganizationAccess(
			validatedParams.organizationId
		);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Appel à la fonction cacheable
		return fetchAddress(validatedParams, session.user.id);
	} catch (error) {
		console.error("[GET_ADDRESS]", error);
		throw error;
	}
}
