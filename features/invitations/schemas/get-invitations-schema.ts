import { InvitationStatus } from "@prisma/client";
import { z } from "zod";
import INVITATION_SORTABLE_FIELDS from "../lib/invitation-sortable-fields";

const GetInvitationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z.enum(INVITATION_SORTABLE_FIELDS).optional().default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
	status: z.nativeEnum(InvitationStatus).optional(),
});

export type GetInvitationsParams = z.infer<typeof GetInvitationsSchema>;

export default GetInvitationsSchema;
