import { SupplierStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du statut d'un fournisseur
 */
export const updateSupplierStatusSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	// Nouveau statut
	status: z.nativeEnum(SupplierStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Statut invalide",
	}),
});
