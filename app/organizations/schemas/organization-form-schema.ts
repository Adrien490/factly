import { z } from "zod";

const OrganizationFormSchema = z.object({
	id: z.string().optional(),
	name: z
		.string()
		.min(1, "Le nom est requis")
		.max(100, "Le nom ne peut pas dépasser 100 caractères"),
	siren: z
		.string()
		.max(9, "Le SIREN doit contenir 9 chiffres")
		.regex(/^[0-9]*$/, "Le SIREN ne doit contenir que des chiffres")
		.optional()
		.or(z.literal("")),
	siret: z
		.string()
		.regex(/^[0-9]{14}$/, "Le SIRET doit contenir 14 chiffres")
		.optional()
		.or(z.literal("")),
	vatNumber: z
		.string()
		.regex(
			/^(FR)?[0-9A-Z]{2}[0-9]{9}$/,
			"Le numéro de TVA doit être au format FR12345678900"
		)
		.optional()
		.or(z.literal("")),
	vatOptionDebits: z.boolean().default(false),
	legalForm: z
		.string()
		.max(50, "La forme juridique ne peut pas dépasser 50 caractères")
		.optional()
		.or(z.literal("")),
	rcsNumber: z
		.string()
		.max(50, "Le numéro RCS ne peut pas dépasser 50 caractères")
		.optional()
		.or(z.literal("")),
	capital: z
		.number()
		.min(0, "Le capital ne peut pas être négatif")
		.optional()
		.nullable(),
	address: z
		.string()
		.max(200, "L'adresse ne peut pas dépasser 200 caractères")
		.optional()
		.or(z.literal("")),
	city: z
		.string()
		.max(100, "La ville ne peut pas dépasser 100 caractères")
		.optional()
		.or(z.literal("")),
	zipCode: z
		.string()
		.regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres")
		.optional()
		.or(z.literal("")),
	country: z
		.string()
		.max(100, "Le pays ne peut pas dépasser 100 caractères")
		.optional()
		.or(z.literal("")),
	phone: z
		.string()
		.regex(
			/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
			"Le numéro de téléphone doit être un numéro français valide"
		)
		.optional()
		.or(z.literal("")),
	email: z
		.string()
		.email("L'email doit être valide")
		.max(100, "L'email ne peut pas dépasser 100 caractères")
		.optional()
		.or(z.literal("")),
	website: z
		.string()
		.url("Le site web doit être une URL valide")
		.max(100, "Le site web ne peut pas dépasser 100 caractères")
		.optional()
		.or(z.literal("")),
});

export type OrganizationInput = z.infer<typeof OrganizationFormSchema>;

export default OrganizationFormSchema;
