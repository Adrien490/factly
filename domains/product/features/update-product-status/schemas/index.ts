import { ProductStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du statut d'un produit
 */
export const updateProductStatusSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du produit est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	// Nouveau statut
	status: z.nativeEnum(ProductStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Statut invalide",
	}),
});
