import { z } from "zod";
import addressFiltersSchema from "./address-filters-schema";

/**
 * Schéma pour récupérer une liste d'adresses avec pagination et tri
 */
const getAddressesSchema = z.object({
	// Organisation à laquelle appartiennent les adresses (via les clients)
	organizationId: z.string(),

	// Terme de recherche textuelle
	search: z.string().optional(),

	// Filtres structurés pour les adresses
	filters: addressFiltersSchema.default({}),
});

// Type pour les paramètres de requête des adresses
export type GetAddressesParams = z.infer<typeof getAddressesSchema>;

export default getAddressesSchema;
