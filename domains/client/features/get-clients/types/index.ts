import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_CLIENTS_DEFAULT_SELECT } from "../constants";
import { getClientsSchema } from "../schemas";

export type GetClientsReturn = {
	clients: Array<
		Prisma.ClientGetPayload<{ select: typeof GET_CLIENTS_DEFAULT_SELECT }>
	>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetClientsParams = z.infer<typeof getClientsSchema>;
