import { SupplierStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la restauration d'un fournisseur
 */
export const restoreSupplierSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	// Statut cible
	status: z.nativeEnum(SupplierStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Statut invalide",
	}),
});
