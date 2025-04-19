import { SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(SupplierStatus),
	z.nativeEnum(SupplierType),
	z.string(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(SupplierStatus)),
	z.array(z.nativeEnum(SupplierType)),
	z.array(z.string()),
]);

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const supplierFiltersSchema = z.record(filterValueSchema);

export const countSuppliersSchema = z.object({
	organizationId: z.string(),
	filters: supplierFiltersSchema.optional().default({}),
});
