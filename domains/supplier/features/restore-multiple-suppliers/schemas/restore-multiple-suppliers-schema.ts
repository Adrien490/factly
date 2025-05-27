import { SupplierStatus } from "@prisma/client";
import { z } from "zod";

export const restoreMultipleSuppliersSchema = z.object({
	ids: z.array(z.string()),
	status: z.nativeEnum(SupplierStatus, {
		required_error: "Le statut cible est requis",
		invalid_type_error: "Statut cible invalide",
	}),
});
