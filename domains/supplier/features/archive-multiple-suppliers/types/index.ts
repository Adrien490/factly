import { z } from "zod";
import { archiveMultipleSuppliersSchema } from "../schemas/archive-multiple-suppliers-schema";

export type ArchiveMultipleSuppliersReturn = {
	number: number;
	shouldClearAll: boolean;
};

export type ArchiveMultipleSuppliersSchema = z.infer<
	typeof archiveMultipleSuppliersSchema
>;
