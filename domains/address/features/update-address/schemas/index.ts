import { AddressType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de mise à jour d'adresse
 * Basé sur le modèle Prisma Address
 */
export const updateAddressSchema = z.object({
	// ID de l'adresse (obligatoire pour la mise à jour)
	id: z.string().min(1, "L'ID de l'adresse est requis"),

	// Organisation
	organizationId: z.string().min(1, "L'organisation est requise"),

	// Informations d'adresse
	addressType: z.nativeEnum(AddressType).default(AddressType.BILLING),
	addressLine1: z.string().min(1, "L'adresse est requise"),
	addressLine2: z.string().optional(),
	postalCode: z.string().min(1, "Le code postal est requis"),
	city: z.string().min(1, "La ville est requise"),
	country: z.string().optional().default("France"),
	isDefault: z.boolean().default(false),

	// Coordonnées géographiques
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),

	// Relations optionnelles - ID du client ou du fournisseur associé
	clientId: z.string().optional().nullable(),
	supplierId: z.string().optional().nullable(),
});
