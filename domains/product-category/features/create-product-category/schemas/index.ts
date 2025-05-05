import { ProductCategoryStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de catégorie de produit
 * Basé sur le modèle Prisma ProductCategory
 */
export const createProductCategorySchema = z.object({
	// Identifiants
	organizationId: z.string().min(1, "L'organisation est requise"),

	// Informations de base
	name: z.string().min(1, "Le nom est requis"),
	slug: z
		.string()
		.min(1, "Le slug est requis")
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			message:
				"Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets",
		}),
	description: z.string().optional(),
	imageUrl: z.string().optional().nullable(),

	// Hiérarchie
	parentId: z.string().optional().nullable(),

	// Paramètres
	status: z
		.nativeEnum(ProductCategoryStatus)
		.default(ProductCategoryStatus.ACTIVE),
});
