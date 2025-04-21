import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_CLIENT_DEFAULT_SELECT } from "../constants";
import { getClientSchema } from "../schemas";

export type GetClientReturn = Prisma.ClientGetPayload<{
	select: typeof GET_CLIENT_DEFAULT_SELECT;
}> | null;

export type GetClientParams = z.infer<typeof getClientSchema>;
