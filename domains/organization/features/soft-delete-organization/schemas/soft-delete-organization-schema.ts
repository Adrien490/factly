import { z } from "zod";

export const softDeleteOrganizationSchema = z.object({
	id: z.string(),
	confirmation: z.literal("SUPPRIMER", {
		errorMap: () => ({ message: "Veuillez écrire SUPPRIMER pour confirmer" }),
	}),
});
