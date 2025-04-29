import { ClientStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du statut d'un client
 */
export const updateClientStatusSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	// Nouveau statut
	status: z.nativeEnum(ClientStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Statut invalide",
	}),
});
