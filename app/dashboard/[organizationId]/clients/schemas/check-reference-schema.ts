import { z } from "zod";

const CheckReferenceSchema = z.object({
	reference: z.string().min(1),
	organizationId: z.string().min(1),
});

export default CheckReferenceSchema;
