import { z } from "zod";

export const deleteContactSchema = z
	.object({
		id: z.string().min(1, "L'identifiant du contact est requis"),
		organizationId: z
			.string()
			.min(1, "L'identifiant de l'organisation est requis"),
		clientId: z.string().nullable(),
		supplierId: z.string().nullable(),
	})
	.refine((data) => data.clientId || data.supplierId, {
		message: "Un client ou un fournisseur doit être spécifié",
		path: ["clientId"],
	});

export type DeleteContactInput = z.infer<typeof deleteContactSchema>;
