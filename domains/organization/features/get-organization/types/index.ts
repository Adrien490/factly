import { Prisma } from "@prisma/client";
import { GET_ORGANIZATION_DEFAULT_SELECT } from "../constants";

export type GetOrganizationReturn = Prisma.OrganizationGetPayload<{
	select: typeof GET_ORGANIZATION_DEFAULT_SELECT;
}>;
