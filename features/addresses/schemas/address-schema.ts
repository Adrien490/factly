import { AddressType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de base pour une adresse
 */
export const addressSchema = z.object({
	addressType: z.nativeEnum(AddressType, {
		required_error: "Le type d'adresse est requis",
		invalid_type_error: "Type d'adresse invalide",
	}),
	line1: z
		.string()
		.min(2, "L'adresse doit comporter au moins 2 caractères")
		.max(100, "L'adresse ne peut pas dépasser 100 caractères"),
	line2: z
		.string()
		.max(100, "La ligne 2 ne peut pas dépasser 100 caractères")
		.optional()
		.nullable(),
	postalCode: z
		.string()
		.min(2, "Le code postal doit comporter au moins 2 caractères")
		.max(10, "Le code postal ne peut pas dépasser 10 caractères"),
	city: z
		.string()
		.min(2, "La ville doit comporter au moins 2 caractères")
		.max(50, "La ville ne peut pas dépasser 50 caractères"),
	region: z
		.string()
		.max(50, "La région ne peut pas dépasser 50 caractères")
		.optional()
		.nullable(),
	country: z
		.string()
		.min(2, "Le pays doit comporter au moins 2 caractères")
		.max(50, "Le pays ne peut pas dépasser 50 caractères")
		.default("France"),
	isDefault: z.boolean().default(false),

	// Coordonnées géographiques optionnelles
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),

	// Relations
	clientId: z.string().optional().nullable(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

/**
 * Schéma pour créer une adresse
 */
export const createAddressSchema = addressSchema.extend({
	clientId: z.string({
		required_error: "L'ID du client est requis",
	}),
});

/**
 * Schéma pour mettre à jour une adresse
 */
export const updateAddressSchema = createAddressSchema.extend({
	id: z.string({
		required_error: "L'ID de l'adresse est requis",
	}),
});

/**
 * Type pour créer une adresse
 */
export type CreateAddressInput = z.infer<typeof createAddressSchema>;

/**
 * Type pour mettre à jour une adresse
 */
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

/**
 * Type pour une adresse
 */
export type AddressInput = z.infer<typeof addressSchema>;

export default addressSchema;
