import { z } from "zod";

/**
 * Schéma pour récupérer une adresse spécifique
 */
const getAddressSchema = z.object({
	// ID de l'adresse à récupérer
	id: z.string().min(1, "L'ID est requis"),

	// Organisation à laquelle appartient l'adresse (via le client)
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default getAddressSchema;
