import { ProductStatus, VatRate } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire de mise à jour de produit
 * Basé sur le modèle Prisma Product
 */
export const updateProductSchema = z.object({
	// ID du produit
	id: z.string().min(1, "L'ID du produit est requis"),

	// Informations de base
	reference: z.string().min(1, "La référence est requise"),
	name: z.string().min(1, "Le nom est requis"),
	description: z.string().optional().nullable(),
	status: z
		.nativeEnum(ProductStatus, {
			errorMap: () => ({ message: "Le statut est requis" }),
		})
		.default(ProductStatus.ACTIVE),

	// Image principale
	imageUrl: z.string().optional().nullable(),

	// Prix et taxation
	price: z.number().min(0, "Le prix doit être positif"),
	vatRate: z
		.nativeEnum(VatRate, {
			errorMap: () => ({ message: "Le taux de TVA est requis" }),
		})
		.default(VatRate.STANDARD),

	// Dimensions et poids
	weight: z.number().optional().nullable(),
	width: z.number().optional().nullable(),
	height: z.number().optional().nullable(),
	depth: z.number().optional().nullable(),

	// Relations
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	categoryId: z.string().optional().nullable(),
	supplierId: z.string().optional().nullable(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
