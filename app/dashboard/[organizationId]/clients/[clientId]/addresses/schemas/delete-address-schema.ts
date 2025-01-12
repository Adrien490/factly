import { z } from "zod";

const deleteAddressSchema = z.object({
	id: z.string().min(1, "L'ID de l'adresse est requis"),
	clientId: z.string().min(1, "L'ID du client est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
});

export default deleteAddressSchema;

// Type d'inférence pour TypeScript
export type DeleteAddressData = z.infer<typeof deleteAddressSchema>;
