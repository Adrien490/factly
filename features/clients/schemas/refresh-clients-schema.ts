import { z } from "zod";

const refreshClientsSchema = z.object({
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default refreshClientsSchema;
