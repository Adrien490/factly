import { z } from "zod";
import { deleteMultipleAddressesSchema } from "../schemas";

export type DeleteMultipleAddressesParams = z.infer<
	typeof deleteMultipleAddressesSchema
>;
export type DeleteMultipleAddressesReturn = {
	success: boolean;
	count: number;
	message: string;
};
