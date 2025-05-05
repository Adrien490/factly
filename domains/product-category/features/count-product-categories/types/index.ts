import { z } from "zod";
import { countProductCategoriesSchema } from "../schemas";

export type CountProductCategoriesParams = z.infer<
	typeof countProductCategoriesSchema
>;

// Type de retour simplifié
export type CountProductCategoriesReturn = number;
