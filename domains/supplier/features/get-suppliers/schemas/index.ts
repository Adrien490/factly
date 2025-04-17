import { sortOrderSchema } from "@/shared/schemas";
import { SupplierStatus, SupplierType } from "@prisma/client";
import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques (chaînes)
	z.nativeEnum(SupplierStatus),
	z.nativeEnum(SupplierType),
	z.string(),
	z.boolean(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(SupplierStatus)),
	z.array(z.nativeEnum(SupplierType)),
	z.array(z.string()),
]);

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const supplierFiltersSchema = z.record(filterValueSchema);

export const getSuppliersSchema = z.object({
	organizationId: z.string(),
	search: z.string().optional(),
	filters: supplierFiltersSchema.default({}),
	page: z.number().default(1),
	perPage: z.number().default(10),
	sortBy: z.string().default("createdAt"),
	sortOrder: sortOrderSchema.default("desc"),
});
