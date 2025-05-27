"use server";

import { auth } from "@/domains/auth";
import db from "@/shared/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { getAddressSchema } from "../schemas";
import { fetchAddress } from "./fetch-address";

/**
 * Récupère les détails d'une adresse spécifique
 * Gère l'authentification et les accès avant d'appeler la fonction cacheable
 */
export async function getAddress(params: z.infer<typeof getAddressSchema>) {
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

		// D'abord récupérer l'adresse pour vérifier ses relations
		const address = await db.address.findUnique({
			where: { id: validatedParams.id },
			select: {
				clientId: true,
				supplierId: true,
			},
		});

		if (!address) {
			throw new Error("Address not found");
		}

		// Vérifier que l'adresse appartient à l'organisation spécifiée
		// Pour cela, on doit vérifier via le client ou le fournisseur selon le cas
		if (address.clientId) {
			// Pour les adresses liées à un client
			const client = await db.client.findUnique({
				where: { id: address.clientId },
			});

			if (!client) {
				throw new Error(
					"Address does not belong to the specified organization"
				);
			}
		} else if (address.supplierId) {
			// Pour les adresses liées à un fournisseur
			const supplier = await db.supplier.findUnique({
				where: { id: address.supplierId },
			});

			if (!supplier) {
				throw new Error(
					"Address does not belong to the specified organization"
				);
			}
		} else {
			// Si l'adresse n'est liée ni à un client ni à un fournisseur
			throw new Error("Address is not associated with any entity");
		}

		// Appel à la fonction cacheable pour récupérer l'adresse complète
		return fetchAddress(validatedParams);
	} catch (error) {
		console.error("[GET_ADDRESS]", error);
		throw error;
	}
}
