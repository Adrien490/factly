import { z } from "zod";

const OrganizationFormSchema = z.object({
	id: z.string().optional(),
	name: z
		.string({
			required_error: "Le nom est requis",
			invalid_type_error: "Le nom doit être une chaîne de caractères",
		})
		.min(2, "Le nom doit contenir au moins 2 caractères")
		.max(50, "Le nom ne doit pas dépasser 50 caractères"),
	logo: z.string().optional(),
	siren: z.string().optional(),
	siret: z.string().optional(),
	vatNumber: z.string().optional(),
	vatOptionDebits: z.boolean().optional(),
	legalForm: z.string().optional(),
	rcsNumber: z.string().optional(),
	capital: z.number().nullable().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email("L'email n'est pas valide").optional(),
	website: z.string().optional(),
});

export default OrganizationFormSchema;
