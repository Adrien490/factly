import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../constants";
import { getClientSchema } from "../schemas";

export type GetClientReturn = Prisma.ClientGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;

export type GetClientParams = z.infer<typeof getClientSchema>;
