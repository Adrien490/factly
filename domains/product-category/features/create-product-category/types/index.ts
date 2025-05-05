import { z } from "zod";
import { createProductCategorySchema } from "../schemas";

export type CreateProductCategoryInput = z.infer<
	typeof createProductCategorySchema
>;
