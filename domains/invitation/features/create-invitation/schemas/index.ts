import { InvitationStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'invitation
 * Basé sur le modèle Prisma Invitation
 */
export const createInvitationSchema = z.object({
	// Identifiants et relations
	organizationId: z.string().min(1, "L'organisation est requise"),
	userId: z.string().min(1, "L'utilisateur invitant est requis"),

	// Informations de base
	email: z.string().email("L'adresse email est invalide"),

	// Statut et expiration
	status: z.nativeEnum(InvitationStatus).default(InvitationStatus.PENDING),
	expiresAt: z.date().min(new Date(), "La date d'expiration doit être future"),
});
