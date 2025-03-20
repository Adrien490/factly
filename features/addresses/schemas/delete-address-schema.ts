import { z } from "zod";

/**
 * Schéma pour supprimer une adresse spécifique
 */
const deleteAddressSchema = z.object({
	id: z.string().min(1, "L'ID de l'adresse est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default deleteAddressSchema;
