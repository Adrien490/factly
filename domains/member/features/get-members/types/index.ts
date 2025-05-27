import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_MEMBERS_DEFAULT_SELECT } from "../constants";
import { getMembersSchema } from "../schemas";

export type GetMembersReturn = {
	members: Array<
		Prisma.MemberGetPayload<{ select: typeof GET_MEMBERS_DEFAULT_SELECT }>
	>;
	pagination: {
		page: number;
		perPage: number;
		total: number;
		pageCount: number;
	};
};

export type GetMembersParams = z.infer<typeof getMembersSchema>;
