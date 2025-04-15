import { z } from "zod";
import { countClientsSchema } from "../schemas";

export type CountClientsReturn = {
	count: number;
};

export type CountClientsParams = z.infer<typeof countClientsSchema>;
