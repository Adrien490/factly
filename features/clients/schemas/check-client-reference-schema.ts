import { z } from "zod";

const checkClientReferenceSchema = z.object({
	reference: z.string().min(1),
	organizationId: z.string().min(1),
});

export default checkClientReferenceSchema;
