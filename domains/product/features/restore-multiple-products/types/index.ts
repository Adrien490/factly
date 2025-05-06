import { z } from "zod";
import { restoreMultipleProductsSchema } from "../schemas/restore-multiple-products-schema";

export type RestoreMultipleProductsReturn = {
	number: number;
	shouldClearAll: boolean;
	restoredProductIds: string[];
};

export type RestoreMultipleProductsSchema = z.infer<
	typeof restoreMultipleProductsSchema
>;
