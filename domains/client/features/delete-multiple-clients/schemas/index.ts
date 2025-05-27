import { z } from "zod";

export const deleteMultipleClientsSchema = z.object({
	ids: z.array(z.string()).min(1, "Sélectionnez au moins un client"),
});
