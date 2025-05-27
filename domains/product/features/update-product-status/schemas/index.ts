import { ProductStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du statut d'un produit
 */
export const updateProductStatusSchema = z.object({
	id: z.string().min(1, "L'ID du produit est requis"),
	status: z.nativeEnum(ProductStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Le statut n'est pas valide",
	}),
});

export type UpdateProductStatusInput = z.infer<
	typeof updateProductStatusSchema
>;
