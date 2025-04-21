import { AddressType, Country } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'adresse
 * Basé sur le modèle Prisma Address
 */
export const createAddressSchema = z.object({
	// Organisation
	organizationId: z.string().min(1, "L'organisation est requise"),

	// Informations d'adresse
	addressType: z.nativeEnum(AddressType).default(AddressType.BILLING),
	addressLine1: z.string().min(1, "L'adresse est requise"),
	addressLine2: z.string().optional(),
	postalCode: z.string().min(1, "Le code postal est requis"),
	city: z.string().min(1, "La ville est requise"),
	country: z.nativeEnum(Country).default(Country.FRANCE),
	isDefault: z.boolean().default(false),

	// Coordonnées géographiques
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),

	// Relations optionnelles - ID du client ou du fournisseur associé
	clientId: z.string().optional().nullable(),
	supplierId: z.string().optional().nullable(),
});
