import { z } from "zod";

// Paramètres pour la recherche d'adresse
export interface SearchAddressParams {
	query: string;
	limit?: number;
	type?: "housenumber" | "street" | "locality" | "municipality";
	postcode?: string;
	citycode?: string;
	lat?: number;
	lon?: number;
	autocomplete?: boolean;
}

// Schéma de validation des paramètres de recherche
export const searchAddressSchema = z.object({
	query: z.string().min(1),
	limit: z.number().min(1).max(100).optional(),
	type: z
		.enum(["housenumber", "street", "locality", "municipality"])
		.optional(),
	postcode: z.string().regex(/^\d+$/).optional(),
	citycode: z.string().regex(/^\d+$/).optional(),
	lat: z.number().min(-90).max(90).optional(),
	lon: z.number().min(-180).max(180).optional(),
	autocomplete: z.boolean().optional(),
});
