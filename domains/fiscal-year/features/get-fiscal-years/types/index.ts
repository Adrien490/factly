import { Prisma } from "@prisma/client";
import { z } from "zod";
import { GET_FISCAL_YEARS_DEFAULT_SELECT } from "../constants";
import { getFiscalYearsSchema } from "../schemas";

export type GetFiscalYearsParams = z.infer<typeof getFiscalYearsSchema>;

export type GetFiscalYearsReturn = Array<
	Prisma.FiscalYearGetPayload<{
		select: typeof GET_FISCAL_YEARS_DEFAULT_SELECT;
	}>
>;
