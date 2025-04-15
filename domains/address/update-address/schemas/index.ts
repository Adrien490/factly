import { z } from "zod";
import { addressBaseSchema } from "../../create-address/schemas";

// Schéma pour la mise à jour d'une adresse
export const updateAddressSchema = addressBaseSchema.partial().extend({
	id: z.string(),
});
