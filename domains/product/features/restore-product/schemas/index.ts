import { ProductStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la restauration d'un produit
 */
export const restoreProductSchema = z.object({
	id: z.string().min(1, "L'ID du produit est requis"),
	status: z.nativeEnum(ProductStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Le statut n'est pas valide",
	}),
});

export type RestoreProductInput = z.infer<typeof restoreProductSchema>;
