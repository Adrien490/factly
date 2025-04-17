import { AddressType, SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire fournisseur
 * Basé sur le modèle Prisma Supplier
 */
export const createSupplierSchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),

	// Informations de base
	name: z.string().min(1, "Le nom est requis"),
	legalName: z.string().optional(),
	email: z.string().email("Email invalide").optional().or(z.literal("")),
	phone: z.string().optional(),
	website: z.string().url("URL invalide").optional().or(z.literal("")),

	// Classification
	supplierType: z.nativeEnum(SupplierType).default(SupplierType.MANUFACTURER),
	status: z.nativeEnum(SupplierStatus).default(SupplierStatus.ACTIVE),

	// Informations fiscales
	siren: z.string().optional(),
	siret: z.string().optional(),
	vatNumber: z.string().optional(),

	// Notes et informations supplémentaires
	notes: z.string().optional(),

	// Adresse
	addressType: z.nativeEnum(AddressType),
	addressLine1: z.string().optional(),
	addressLine2: z.string().optional(),
	postalCode: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional().default("France"),

	// Coordonnées géographiques
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),
});
