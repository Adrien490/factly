import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_COMPANY_DEFAULT_SELECT } from "../constants";
import { getCompanySchema } from "../schemas/get-company-schema";

export type GetCompanyReturn = Prisma.CompanyGetPayload<{
	select: typeof GET_COMPANY_DEFAULT_SELECT;
}> | null;

export type GetCompanyParams = z.infer<typeof getCompanySchema>;
