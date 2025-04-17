import db from "@/shared/lib/db";
import { z } from "zod";
import { GET_ADDRESS_DEFAULT_SELECT } from "../constants";
import { getAddressSchema } from "../schemas";

/**
 * Fonction interne cacheable qui récupère une adresse
 */
export async function fetchAddress(params: z.infer<typeof getAddressSchema>) {
	try {
		// Récupérer l'adresse
		const address = await db.address.findUnique({
			where: { id: params.id },
			select: GET_ADDRESS_DEFAULT_SELECT,
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
