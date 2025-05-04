import { ClientStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la restauration d'un client
 */
export const restoreClientSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	// Statut cible
	status: z.nativeEnum(ClientStatus, {
		required_error: "Le statut est requis",
		invalid_type_error: "Statut invalide",
	}),
});
