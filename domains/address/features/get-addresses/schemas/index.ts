import { sortOrderSchema } from "@/shared/schemas";
import { AddressType } from "@prisma/client";
import { z } from "zod";

const filterValueSchema = z.union([
	// Valeurs uniques
	z.nativeEnum(AddressType),
	z.string(),
	z.boolean(),

	// Tableaux de valeurs
	z.array(z.nativeEnum(AddressType)),
	z.array(z.string()),
]);

// Le schéma accepte des enregistrements dont les valeurs
// peuvent être soit des valeurs uniques, soit des tableaux
const addressFiltersSchema = z.record(filterValueSchema);

export const getAddressesSchema = z
	.object({
		organizationId: z.string(),
		// Un des deux doit être fourni
		supplierId: z.string().optional(),
		clientId: z.string().optional(),
		search: z.string().optional(),
		filters: addressFiltersSchema.default({}),
		sortBy: z.string().default("createdAt"),
		sortOrder: sortOrderSchema.default("desc"),
	})
	.refine((data) => data.supplierId || data.clientId, {
		message: "Vous devez spécifier supplierId ou clientId",
		path: ["supplierId"],
	});
