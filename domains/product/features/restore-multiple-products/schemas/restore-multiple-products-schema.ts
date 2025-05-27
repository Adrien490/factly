import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const restoreMultipleProductsSchema = z.object({
	ids: z.array(z.string()),
	status: z.nativeEnum(ProductStatus, {
		required_error: "Le statut cible est requis",
		invalid_type_error: "Statut cible invalide",
	}),
});
