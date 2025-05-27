import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_MEMBER_DEFAULT_SELECT } from "../constants";
import { getMemberSchema } from "../schemas/get-member-schema";

export type GetMemberReturn = Prisma.MemberGetPayload<{
	select: typeof GET_MEMBER_DEFAULT_SELECT;
}> | null;

export type GetMemberParams = z.infer<typeof getMemberSchema>;
