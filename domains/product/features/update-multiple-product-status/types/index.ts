import { ProductStatus } from "@prisma/client";
import { z } from "zod";
import { updateMultipleProductStatusSchema } from "../schemas/update-multiple-product-status-schema";

export type UpdateMultipleProductStatusReturn = {
	number: number;
	status: ProductStatus;
	shouldClearAll: boolean;
	updatedProductIds: string[];
};

export type UpdateMultipleProductStatusSchema = z.infer<
	typeof updateMultipleProductStatusSchema
>;
