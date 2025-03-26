import db from "@/shared/lib/db";
import { z } from "zod";
import { DEFAULT_SELECT } from "../../constants";
import { getAddressesSchema } from "../schemas";
import { GetAddressesReturn } from "../types";

/**
 * Fonction interne qui récupère les adresses
 */
export async function fetchAddresses(
	params: z.infer<typeof getAddressesSchema>
): Promise<GetAddressesReturn> {
	try {
		const where = {
			...(params.clientId ? { clientId: params.clientId } : {}),
			...(params.supplierId ? { supplierId: params.supplierId } : {}),
		};

		// Obtenir les adresses
		const addresses = await db.address.findMany({
			where,
			select: DEFAULT_SELECT,
			orderBy: params.sortBy
				? { [params.sortBy]: params.sortOrder || "asc" }
				: [
						{ isDefault: "desc" }, // Adresses par défaut en premier
						{ updatedAt: "desc" }, // Puis les plus récemment modifiées
				  ],
		});

		return addresses;
	} catch (error) {
		console.error("Erreur lors de la récupération des adresses:", error);
		return [];
	}
}
