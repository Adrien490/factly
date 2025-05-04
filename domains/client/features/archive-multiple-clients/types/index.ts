import { z } from "zod";
import { archiveMultipleClientsSchema } from "../schemas/archive-multiple-clients-schema";

export type ArchiveMultipleClientsReturn = {
	number: number;
	shouldClearAll: boolean;
};

export type ArchiveMultipleClientsSchema = z.infer<
	typeof archiveMultipleClientsSchema
>;
