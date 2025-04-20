import { Prisma } from "@prisma/client";
import { GET_INVITATION_DEFAULT_SELECT } from "../constants";

export type GetInvitationReturn = Prisma.InvitationGetPayload<{
	select: typeof GET_INVITATION_DEFAULT_SELECT;
}>;
