import { Prisma } from "@prisma/client";
import { DEFAULT_SELECT } from "../constants";

export type GetClientsReturn = {
	clients: Array<Prisma.ClientGetPayload<{ select: typeof DEFAULT_SELECT }>>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};
