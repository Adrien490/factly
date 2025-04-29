import { ClientStatus } from "@prisma/client";
import { z } from "zod";
import { updateMultipleClientStatusSchema } from "../schemas/update-multiple-client-status-schema";

export type UpdateMultipleClientStatusReturn = {
	number: number;
	status: ClientStatus;
	shouldClearSelection: boolean;
};

export type UpdateMultipleClientStatusSchema = z.infer<
	typeof updateMultipleClientStatusSchema
>;
