import { z } from "zod";

export const updateContactSchema = z.object({
	id: z.string().min(1, "L'ID du contact est requis"),
	civility: z.string().optional(),
	firstName: z.string().min(1, "Le prénom est requis"),
	lastName: z.string().min(1, "Le nom est requis"),
	function: z.string().optional(),
	email: z.string().email("Email invalide").optional().or(z.literal("")),
	phoneNumber: z.string().optional(),
	mobileNumber: z.string().optional(),
	faxNumber: z.string().optional(),
	website: z.string().optional(),
	notes: z.string().optional(),
	isDefault: z.boolean().default(false),
});

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
