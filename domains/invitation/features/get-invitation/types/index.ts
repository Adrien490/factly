import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_INVITATION_DEFAULT_SELECT } from "../constants";
import { getInvitationSchema } from "../schemas";

export type GetInvitationReturn = Prisma.InvitationGetPayload<{
	select: typeof GET_INVITATION_DEFAULT_SELECT;
}>;

export type GetInvitationParams = z.infer<typeof getInvitationSchema>;
