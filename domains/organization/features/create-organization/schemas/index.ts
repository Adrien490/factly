import { Country, LegalForm } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'organisation
 * Basé sur le modèle Prisma Organization
 */
export const createOrganizationSchema = z.object({
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
	website: z.string().optional().nullable(),

	// Informations fiscales
	siren: z
		.string()
		.refine((val) => val === "" || /^\d{9}$/.test(val), {
			message: "Le SIREN doit être composé de 9 chiffres",
		})
		.optional()
		.nullable(),
	siret: z
		.string()
		.refine((val) => val === "" || /^\d{14}$/.test(val), {
			message: "Le SIRET doit être composé de 14 chiffres",
		})
		.optional()
		.nullable(),
	vatNumber: z.string().optional().nullable(),

	// Adresse
	addressLine1: z.string().optional().nullable(),
	addressLine2: z.string().optional().nullable(),
	postalCode: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	country: z.nativeEnum(Country).default(Country.FRANCE),

	// Champs système
	creatorId: z.string().optional(),
});
