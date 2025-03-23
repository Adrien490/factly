import { Prisma } from "@prisma/client";
import { DEFAULT_SELECT } from "../constants";

export type GetOrganizationReturn = Prisma.OrganizationGetPayload<{
	select: typeof DEFAULT_SELECT;
}>;
