"use server";

import { auth } from "@/domains/auth";
import { hasOrganizationAccess } from "@/domains/organization";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../../constants";
import { getAddressSchema } from "../schemas";
import { GetAddressReturn } from "../types";

/**
 * Récupère une adresse par son ID
 */
export async function getAddress(
	params: z.infer<typeof getAddressSchema>
): Promise<GetAddressReturn | null> {
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

		// Récupérer l'adresse
		const address = await db.address.findUnique({
			where: { id: validatedParams.id },
			select: DEFAULT_SELECT,
		});

		if (!address) {
			return null;
		}

		// Vérifier les droits d'accès à l'organisation
		const organizationId = address.clientId || address.supplierId;

		if (!organizationId) {
			throw new Error("Address is not associated with any organization");
		}

		const hasAccess = await hasOrganizationAccess(organizationId);

		if (!hasAccess) {
			throw new Error("Access denied");
		}

		// Retourner l'adresse sans les relations client/supplier imbriquées
		return {
			id: address.id,
			addressLine1: address.addressLine1,
			addressLine2: address.addressLine2,
			postalCode: address.postalCode,
			city: address.city,
			country: address.country,
			latitude: address.latitude,
			longitude: address.longitude,
			isDefault: address.isDefault,
			clientId: address.clientId,
			supplierId: address.supplierId,
			createdAt: address.createdAt,
			updatedAt: address.updatedAt,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("Invalid parameters");
		}

		throw error;
	}
}
