import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";
import { FISCAL_YEAR_SORTABLE_FIELDS } from "../constants";

/**
 * Schéma de validation pour la récupération des années fiscales
 */
export const getFiscalYearsSchema = z.object({
	organizationId: z.string().min(1, "L'ID de l'organisation est requis"),
	search: z.string().optional(),
	status: z.nativeEnum(FiscalYearStatus).optional(),
	isCurrent: z.boolean().optional(),
	sortBy: z.enum(FISCAL_YEAR_SORTABLE_FIELDS).optional().default("startDate"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});
