import { z } from "zod";
import { restoreMultipleClientsSchema } from "../schemas/restore-multiple-clients-schema";

export type RestoreMultipleClientsReturn = {
	number: number;
	shouldClearAll: boolean;
	restoredClientIds: string[];
};

export type RestoreMultipleClientsSchema = z.infer<
	typeof restoreMultipleClientsSchema
>;
