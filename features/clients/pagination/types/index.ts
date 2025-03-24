import { z } from "zod";
import { getClientsPaginationSchema } from "../schemas";

export type ClientPaginationParams = z.infer<typeof getClientsPaginationSchema>;

export type GetClientsPaginationReturn = {
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};
