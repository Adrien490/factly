import { InvitationStatus } from "@prisma/client";
import { z } from "zod";
import { INVITATION_SORTABLE_FIELDS } from "../constants";

/**
 * Schéma de validation pour la récupération des invitations
 * Sans recherche textuelle comme demandé
 */
export const getInvitationsSchema = z.object({
	organizationId: z.string().optional(),
	status: z
		.union([
			z.nativeEnum(InvitationStatus),
			z.array(z.nativeEnum(InvitationStatus)),
		])
		.optional(),
	expiresAt: z.enum(["expired", "active"]).optional(),
	email: z.string().email().optional(),
	userId: z.string().optional(),
	sortBy: z.enum(INVITATION_SORTABLE_FIELDS).optional().default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
