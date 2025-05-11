import { ClientStatus, ClientType } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour d'un client
 * Basé sur le modèle Prisma Client
 */
export const updateClientSchema = z.object({
	// Identifiants
	id: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'organisation est requise"),
	reference: z
		.string()
		.min(3, "La référence doit comporter au moins 3 caractères"),
	clientType: z.nativeEnum(ClientType).default(ClientType.INDIVIDUAL),
	status: z.nativeEnum(ClientStatus).default(ClientStatus.ACTIVE),
	notes: z.string().optional().nullable(),
});
