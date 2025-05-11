import { z } from "zod";

export const updateContactSchema = z.object({
	id: z.string().min(1, "L'identifiant du contact est requis"),
	organizationId: z
		.string()
		.min(1, "L'identifiant de l'organisation est requis"),
	clientId: z.string().nullable(),
	supplierId: z.string().nullable(),
	firstName: z.string().min(1, "Le prénom est requis"),
	lastName: z.string().min(1, "Le nom est requis"),
	civility: z.string().min(1, "La civilité est requise"),
	function: z.string().optional(),
	email: z
		.string()
		.email("L'email n'est pas valide")
		.optional()
		.or(z.literal("")),
	phoneNumber: z
		.string()
		.regex(/^\+?[0-9\s-]{10,}$/, "Le numéro de téléphone n'est pas valide")
		.optional()
		.or(z.literal("")),
	mobileNumber: z
		.string()
		.regex(/^\+?[0-9\s-]{10,}$/, "Le numéro de mobile n'est pas valide")
		.optional()
		.or(z.literal("")),
	faxNumber: z
		.string()
		.regex(/^\+?[0-9\s-]{10,}$/, "Le numéro de fax n'est pas valide")
		.optional()
		.or(z.literal("")),
	website: z
		.string()
		.regex(
			/^https?:\/\/[^\s/$.?#].[^\s]*$/,
			"L'URL du site web n'est pas valide"
		)
		.optional()
		.or(z.literal("")),
	isDefault: z.boolean().default(false),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
