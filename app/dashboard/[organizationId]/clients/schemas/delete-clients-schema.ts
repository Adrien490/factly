import { z } from "zod";

const deleteClientsSchema = z.object({
	ids: z.array(z.string().min(1)).min(1),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default deleteClientsSchema;
