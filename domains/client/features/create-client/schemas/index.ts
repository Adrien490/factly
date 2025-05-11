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
 * Schéma de validation pour la création d'un client
 * Basé sur le modèle Prisma Client
 */
export const createClientSchema = z.object({
	// Identifiants
	organizationId: z.string(),
	reference: z.string().optional(),
	clientType: z.nativeEnum(ClientType),
	status: z.nativeEnum(ClientStatus),
	logoUrl: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),

	// Champs du contact
	civility: z.nativeEnum(Civility),
	firstname: z.string().optional().nullable(),
	lastname: z.string().optional().nullable(),
	contactFunction: z.string().optional().nullable(),
	email: z.string().email("Format d'email invalide").optional().nullable(),
	phoneNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de téléphone invalide"
		)
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	mobileNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de mobile invalide"
		)
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	faxNumber: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
			"Format de numéro de fax invalide"
		)
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	website: z
		.string()
		.url("Format d'URL invalide")
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),

	// Champs de l'entreprise (optionnels)
	companyName: z.string().optional().nullable(),
	legalForm: z.nativeEnum(LegalForm).optional().nullable(),
	siren: z
		.string()
		.regex(/^\d{9}$/, "Le numéro SIREN doit comporter exactement 9 chiffres")
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	siret: z
		.string()
		.regex(/^\d{14}$/, "Le numéro SIRET doit comporter exactement 14 chiffres")
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	nafApeCode: z
		.string()
		.regex(
			/^\d{4}[A-Z]$/,
			"Le code NAF/APE doit être au format 4 chiffres suivis d'une lettre"
		)
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	capital: z.string().optional().nullable(),
	rcs: z.string().optional().nullable(),
	vatNumber: z
		.string()
		.regex(
			/^FR\d{2}\d{9}$/,
			"Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres"
		)
		.optional()
		.nullable()
		.transform((val) => (val === "" ? null : val)),
	businessSector: z.nativeEnum(BusinessSector).optional().nullable(),
	employeeCount: z.nativeEnum(EmployeeCount).optional().nullable(),

	// Adresse
	addressType: z.nativeEnum(AddressType),
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.nativeEnum(Country),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
});

export type CreateClientSchema = z.infer<typeof createClientSchema>;
