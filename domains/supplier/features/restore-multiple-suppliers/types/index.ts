import { z } from "zod";
import { restoreMultipleSuppliersSchema } from "../schemas/restore-multiple-suppliers-schema";

export type RestoreMultipleSuppliersReturn = {
	number: number;
	shouldClearAll: boolean;
	restoredSupplierIds: string[];
};

export type RestoreMultipleSuppliersSchema = z.infer<
	typeof restoreMultipleSuppliersSchema
>;
