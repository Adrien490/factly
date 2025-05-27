import { Prisma } from "@prisma/client";
import { z } from "zod";
import { CHECK_MEMBERSHIP_SELECT } from "../constants";
import {
	checkMembershipSchema,
	checkOwnMembershipSchema,
} from "../schemas/check-membership-schema";

export type CheckMembershipReturn = {
	isMember: boolean;
	member: Prisma.MemberGetPayload<{
		select: typeof CHECK_MEMBERSHIP_SELECT;
	}> | null;
	memberSince?: Date;
};

export type CheckMembershipParams = z.infer<typeof checkMembershipSchema>;
export type CheckOwnMembershipParams = z.infer<typeof checkOwnMembershipSchema>;
