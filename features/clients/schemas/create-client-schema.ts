import { ClientPriority, ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire client
 * Basé sur le modèle Prisma Client
 */
const createClientSchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),
	userId: z.string().min(1, "L'utilisateur est requis"),

	// Informations de base
	reference: z
		.string()
		.min(3, "La référence doit comporter au moins 3 caractères"),
	name: z.string().min(1, "Le nom est requis"),
	email: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	website: z.string().optional().nullable(),

	// Classification
	clientType: z.nativeEnum(ClientType).default(ClientType.INDIVIDUAL),
	status: z.nativeEnum(ClientStatus).default(ClientStatus.LEAD),
	priority: z.nativeEnum(ClientPriority).default(ClientPriority.LOW),

	// Informations fiscales
	siren: z.string().optional().nullable(),
	siret: z.string().optional().nullable(),
	vatNumber: z.string().optional().nullable(),

	// Notes et informations supplémentaires
	notes: z.string().optional().nullable(),

	// Adresse
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.string().optional().nullable(),

	// Coordonnées géographiques
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),

	// Relations (optionnelles dans le formulaire)
	tags: z.array(z.string()).optional(),
});

export type ClientFormValues = z.infer<typeof createClientSchema>;

export default createClientSchema;
