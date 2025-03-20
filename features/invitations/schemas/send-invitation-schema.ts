import { InvitationStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour le formulaire d'invitation
 */
const SendInvitationSchema = z.object({
	// Email du destinataire (obligatoire et valide)
	email: z
		.string()
		.min(1, "L'email est obligatoire")
		.email("Format d'email invalide"),

	// ID de l'organisation (obligatoire)
	organizationId: z.string().min(1, "L'organisation est obligatoire"),

	// Statut de l'invitation (optionnel, avec valeur par défaut)
	status: z.nativeEnum(InvitationStatus).default("PENDING"),

	// Message personnel (optionnel)
	message: z.string().optional(),
});

export default SendInvitationSchema;
