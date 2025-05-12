import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_ORGANIZATION_DEFAULT_SELECT } from "../constants";
import { getOrganizationSchema } from "../schemas";

export type GetOrganizationReturn = Prisma.OrganizationGetPayload<{
	select: typeof GET_ORGANIZATION_DEFAULT_SELECT;
}>;

export type GetOrganizationParams = z.infer<typeof getOrganizationSchema>;
