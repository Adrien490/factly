import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../constants";
import { getClientSchema } from "../schemas";

export type GetClientReturn = {
	client: Prisma.ClientGetPayload<{ select: typeof DEFAULT_SELECT }>;
};

export type GetClientParams = z.infer<typeof getClientSchema>;
