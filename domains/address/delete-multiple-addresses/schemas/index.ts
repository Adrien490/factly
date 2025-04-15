import { z } from "zod";

// Schéma pour la suppression multiple d'adresses
export const deleteMultipleAddressesSchema = z.object({
	ids: z
		.array(z.string())
		.min(1, "Au moins une adresse doit être sélectionnée"),
});
