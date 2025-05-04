import { ClientStatus } from "@prisma/client";
import { z } from "zod";

export const restoreMultipleClientsSchema = z.object({
	organizationId: z.string(),
	ids: z.array(z.string()),
	status: z.nativeEnum(ClientStatus, {
		required_error: "Le statut cible est requis",
		invalid_type_error: "Statut cible invalide",
	}),
});
