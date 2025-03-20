import SortOrderSchema from "@/schemas/sort-order-schema";
import { z } from "zod";

/**
 * Schéma de tri générique
 * Utilisé pour standardiser les paramètres de tri dans l'application
 */
const sortingSchema = <T extends [string, ...string[]]>(sortableFields: T) => {
	return z.object({
		sortBy: z.enum(sortableFields).default(sortableFields[0]),
		sortOrder: SortOrderSchema,
	});
};

export type SortingParams<T extends [string, ...string[]]> = z.infer<
	ReturnType<typeof sortingSchema<T>>
>;

export default sortingSchema;
