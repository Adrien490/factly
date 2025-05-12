import { z } from "zod";

export const setDefaultContactSchema = z
	.object({
		id: z.string().min(1, "L'identifiant du contact est requis"),
		organizationId: z
			.string()
			.min(1, "L'identifiant de l'organisation est requis"),
		clientId: z.string().nullable(),
		supplierId: z.string().nullable(),
	})
	.refine(
		(data) => {
			// Vérifie qu'au moins un des deux IDs est fourni
			return Boolean(data.clientId || data.supplierId);
		},
		{
			message: "Vous devez fournir soit un ID client, soit un ID fournisseur",
			path: ["clientId"], // Le message d'erreur s'affichera sur le champ clientId
		}
	)
	.refine(
		(data) => {
			// Vérifie qu'un seul des deux IDs est fourni
			return !(data.clientId && data.supplierId);
		},
		{
			message:
				"Vous ne pouvez pas fournir à la fois un ID client et un ID fournisseur",
			path: ["clientId"], // Le message d'erreur s'affichera sur le champ clientId
		}
	);
