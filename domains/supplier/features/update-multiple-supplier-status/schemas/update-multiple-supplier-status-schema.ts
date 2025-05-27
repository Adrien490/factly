import { SupplierStatus } from "@prisma/client";
import { z } from "zod";

export const updateMultipleSupplierStatusSchema = z.object({
	ids: z.array(z.string()),
	status: z.nativeEnum(SupplierStatus),
});

export type UpdateMultipleSupplierStatusSchema = z.infer<
	typeof updateMultipleSupplierStatusSchema
>;
