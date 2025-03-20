// features/organizations/schemas/organization-schema.ts
import { LegalForm } from "@prisma/client";
import { z } from "zod";

// Validation du code postal français (5 chiffres)
//const frenchPostalCodeRegex = /^[0-9]{5}$/;

const CreateOrganizationSchema = z.object({
	// Section 1: Informations de base (obligatoires)
	name: z.string({
		required_error: "Le nom commercial est requis",
	}),
	legalName: z.string({
		required_error: "La dénomination sociale est requise",
	}),
	logoUrl: z.string().optional().nullable(),

	// Section 2: Identifiants fiscaux (hautement recommandés)
	legalForm: z.nativeEnum(LegalForm, {
		required_error: "La forme juridique est requise",
	}),
	siren: z.string().optional().nullable(),
	siret: z.string().optional().nullable(),
	vatNumber: z.string().optional().nullable(),
	// Section 3: Adresse (recommandée)
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.string().optional().nullable().default("France"),

	// Section 4: Informations complémentaires (optionnelles)
	email: z
		.string({
			required_error: "L'email de contact est requis",
		})
		.email("Format d'email invalide"),
	phone: z.string().optional().nullable(),
	website: z.string().optional().nullable(),
});

export default CreateOrganizationSchema;
export type CreateOrganizationFormData = z.infer<
	typeof CreateOrganizationSchema
>;
