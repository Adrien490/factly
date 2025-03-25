import { z } from "zod";

// Schéma de base pour les addresses sans pagination
export const addressBaseSchema = z.object({
	// Champs obligatoires
	addressLine1: z.string().min(1, "L'adresse est requise"),
	postalCode: z.string().min(1, "Le code postal est requis"),
	city: z.string().min(1, "La ville est requise"),

	// Champs optionnels
	addressLine2: z.string().optional(),
	country: z.string().default("France"),
	latitude: z.number().optional().nullable(),
	longitude: z.number().optional().nullable(),
	isDefault: z.boolean().default(false),

	// Relations (une adresse est toujours liée à un client OU un fournisseur)
	clientId: z.string().optional(),
	supplierId: z.string().optional(),
});

// Schéma pour la création d'une adresse
export const createAddressSchema = addressBaseSchema.refine(
	(data) => data.clientId !== undefined || data.supplierId !== undefined,
	{
		message: "Une adresse doit être associée à un client ou un fournisseur",
		path: ["clientId"],
	}
);
