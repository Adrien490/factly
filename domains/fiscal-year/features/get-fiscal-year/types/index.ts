import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_FISCAL_YEAR_DEFAULT_SELECT } from "../constants";
import { getFiscalYearSchema } from "../schemas";

export type GetFiscalYearReturn = Prisma.FiscalYearGetPayload<{
	select: typeof GET_FISCAL_YEAR_DEFAULT_SELECT;
}> | null;

export type GetFiscalYearParams = z.infer<typeof getFiscalYearSchema>;
