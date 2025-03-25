import { z } from "zod";
import { addressSortableFields } from "../../constants";

export const getAddressesSchema = z
	.object({
		clientId: z.string().optional(),
		supplierId: z.string().optional(),
		sortBy: z.enum(addressSortableFields).optional(),
		sortOrder: z.enum(["asc", "desc"]).optional(),
		perPage: z.number().optional(),
		page: z.number().optional(),
		search: z.string().optional(),
		filters: z.record(z.string(), z.string()).optional(),
	})
	.refine(
		(data) => data.clientId !== undefined || data.supplierId !== undefined,
		{
			message: "Vous devez spécifier un client ou un fournisseur",
			path: ["clientId"],
		}
	);
