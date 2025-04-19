import { z } from "zod";

export const deleteSupplierSchema = z.object({
	id: z.string().min(1, "L'ID du fournisseur est requis"),
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	confirmation: z.string().refine((val) => val.toLowerCase() === "supprimer", {
		message: "Veuillez saisir 'supprimer' pour confirmer la suppression",
	}),
});
