import { LegalForm } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour d'une organisation
 */
export const updateOrganizationSchema = z.object({
	id: z.string().min(1, "L'ID de l'organisation est requis"),

	// Informations de base
	name: z.string().min(1, "Le nom est requis"),
	legalName: z.string().min(1, "La dénomination sociale est requise"),
	legalForm: z.nativeEnum(LegalForm, {
		errorMap: () => ({ message: "La forme juridique est requise" }),
	}),
	logoUrl: z.string().optional().nullable(),

	// Contact
	email: z
		.string()
		.email("Format d'email invalide")
		.min(1, "L'email est requis"),
	phone: z.string().optional().nullable(),
	website: z.string().url("L'URL n'est pas valide").optional().nullable(),

	// Informations fiscales
	siren: z.string().optional().nullable(),
	siret: z.string().optional().nullable(),
	vatNumber: z.string().optional().nullable(),

	// Adresse
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.string().default("France"),
});
