import { z } from "zod";
import { contactFiltersSchema } from "./contact-filters-schema";
import { contactSortBySchema } from "./contact-sort-by-schema";

export const getContactsSchema = z
	.object({
		clientId: z.string().optional(),
		supplierId: z.string().optional(),
		organizationId: z
			.string()
			.min(1, "L'identifiant de l'organisation est requis"),
		search: z.string().optional(),
		sortBy: contactSortBySchema.optional(),
		sortOrder: z.enum(["asc", "desc"]).optional(),
		filters: contactFiltersSchema.optional(),
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
