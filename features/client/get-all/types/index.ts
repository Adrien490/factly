import { Prisma } from "@prisma/client";
import { z } from "zod";
import { DEFAULT_SELECT } from "../constants";
import { getClientsSchema } from "../schemas";

export type GetClientsReturn = {
	clients: Array<Prisma.ClientGetPayload<{ select: typeof DEFAULT_SELECT }>>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetClientsParams = z.infer<typeof getClientsSchema>;
