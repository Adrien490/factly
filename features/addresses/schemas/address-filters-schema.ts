import { AddressType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour les filtres d'adresses
 * Utilisé pour filtrer les adresses dans les requêtes
 */
const addressFiltersSchema = z.object({
	// Filtres par type d'adresse (facturation, livraison)
	addressType: z
		.union([z.nativeEnum(AddressType), z.array(z.nativeEnum(AddressType))])
		.optional(),

	// Filtres de localisation
	city: z.string().optional(),
	postalCode: z.string().optional(),
	country: z.string().optional(),

	// Filtre pour les adresses par défaut
	isDefault: z.boolean().optional(),

	// Relation avec le client
	clientId: z.string().optional(),
});

// Type pour les filtres d'adresses
export type AddressFilters = z.infer<typeof addressFiltersSchema>;

export default addressFiltersSchema;
