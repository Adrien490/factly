import { z } from "zod";

export const createContactSchema = z.object({
	organizationId: z.string(),
	clientId: z.string().nullable(),
	supplierId: z.string().nullable(),
	firstName: z.string().optional(),
	lastName: z.string().min(1, "Le nom est requis"),
	civility: z.string().optional(),
	function: z.string().optional(),
	notes: z.string().optional(),
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

export type CreateContactInput = z.infer<typeof createContactSchema>;
