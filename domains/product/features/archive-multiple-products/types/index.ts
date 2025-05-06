import { z } from "zod";
import { archiveMultipleProductsSchema } from "../schemas/archive-multiple-products-schema";

export type ArchiveMultipleProductsReturn = {
	number: number;
	shouldClearAll: boolean;
};

export type ArchiveMultipleProductsSchema = z.infer<
	typeof archiveMultipleProductsSchema
>;
