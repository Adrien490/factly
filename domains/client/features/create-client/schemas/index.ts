import {
	AddressType,
	BusinessSector,
	Civility,
	ClientStatus,
	ClientType,
	Country,
	EmployeeCount,
	LegalForm,
} from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire client
 * Basé sur le modèle Prisma Client
 */
export const createClientSchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),
	reference: z
		.string()
		.min(3, "La référence doit comporter au moins 3 caractères"),
	clientType: z.nativeEnum(ClientType).default(ClientType.INDIVIDUAL),
	status: z.nativeEnum(ClientStatus).default(ClientStatus.ACTIVE),
	notes: z.string().optional().nullable(),

	// Informations de contact
	civility: z.nativeEnum(Civility).optional().nullable(),
	firstname: z.string().optional().nullable(),
	lastname: z.string().optional().nullable(),
	contactFunction: z.string().optional().nullable(),
	email: z
		.string()
		.email("Format d'email invalide")
		.optional()
		.nullable()
		.or(z.literal("")),
	phoneNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de téléphone invalide"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	mobileNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de mobile invalide"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	faxNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de fax invalide"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	website: z
		.string()
		.url("Format d'URL invalide")
		.optional()
		.nullable()
		.or(z.literal("")),

	// Informations d'entreprise
	companyName: z.string().optional().nullable(),
	legalForm: z.nativeEnum(LegalForm).optional().nullable(),
	sirenNumber: z
		.string()
		.regex(/^\d{9}$/, "Le numéro SIREN doit comporter exactement 9 chiffres")
		.optional()
		.nullable()
		.or(z.literal("")),
	siretNumber: z
		.string()
		.regex(/^\d{14}$/, "Le numéro SIRET doit comporter exactement 14 chiffres")
		.optional()
		.nullable()
		.or(z.literal("")),
	nafApeCode: z
		.string()
		.regex(
			/^[0-9]{4}[A-Z]$/,
			"Le code APE doit être au format 4 chiffres + 1 lettre"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	capital: z
		.string()
		.regex(
			/^\d+(?:[.,]\d{1,2})?$/,
			"Le capital doit être un nombre avec maximum 2 décimales"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	rcs: z
		.string()
		.regex(
			/^[A-Z]\d{8}$/,
			"Le numéro RCS doit commencer par une lettre suivie de 8 chiffres"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	vatNumber: z
		.string()
		.regex(
			/^FR\d{2}\d{9}$/,
			"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
		)
		.optional()
		.nullable()
		.or(z.literal("")),
	businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
	employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),

	// Informations d'adresse
	addressType: z.nativeEnum(AddressType).default(AddressType.BILLING),
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.nativeEnum(Country).default(Country.FRANCE),
	latitude: z.number().nullable().optional(),
	longitude: z.number().nullable().optional(),
});
