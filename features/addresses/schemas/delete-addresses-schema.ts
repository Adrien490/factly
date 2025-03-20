import { z } from "zod";

/**
 * Schéma pour supprimer plusieurs adresses
 */
const deleteAddressesSchema = z.object({
	ids: z
		.array(z.string())
		.min(1, "Au moins une adresse doit être sélectionnée"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default deleteAddressesSchema;
