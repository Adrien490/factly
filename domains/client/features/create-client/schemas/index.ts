import { AddressType, ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire client
 * Basé sur le modèle Prisma Client
 */
export const createClientSchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),
	userId: z.string().min(1, "L'utilisateur est requis"),

	// Informations de base
	reference: z
		.string()
		.min(3, "La référence doit comporter au moins 3 caractères"),
	name: z.string().min(1, "Le nom est requis"),
	email: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),

	// Classification
	clientType: z.nativeEnum(ClientType).default(ClientType.INDIVIDUAL),
	status: z.nativeEnum(ClientStatus).default(ClientStatus.LEAD),

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
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});
