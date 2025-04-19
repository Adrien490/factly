import { InvitationStatus } from "@prisma/client";
import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(InvitationStatus),
	z.string(),

	// Valeurs d'expiration
	z.enum(["expired", "active"]),

	// Tableaux de valeurs
	z.array(z.nativeEnum(InvitationStatus)),
	z.array(z.string()),
]);

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const invitationFiltersSchema = z.record(filterValueSchema);

export const countInvitationsSchema = z.object({
	organizationId: z.string(),
	filters: invitationFiltersSchema.optional().default({}),
});
