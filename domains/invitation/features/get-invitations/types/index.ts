import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
	GET_INVITATIONS_DEFAULT_SELECT,
	INVITATION_SORTABLE_FIELDS,
} from "../constants";
import { getInvitationsSchema } from "../schemas";

export type GetInvitationsParams = z.infer<typeof getInvitationsSchema>;

export type GetInvitationsReturn = Array<
	Prisma.InvitationGetPayload<{
		select: typeof GET_INVITATIONS_DEFAULT_SELECT;
	}>
>;

export type InvitationSortableField =
	(typeof INVITATION_SORTABLE_FIELDS)[number];
