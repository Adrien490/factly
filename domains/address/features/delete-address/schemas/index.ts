import { z } from "zod";

export const deleteAddressSchema = z.object({
	id: z.string().min(1, "L'ID est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});
