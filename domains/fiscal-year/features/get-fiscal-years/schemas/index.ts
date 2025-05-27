import { FiscalYearStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Schéma de validation pour la récupération des années fiscales
 */
export const getFiscalYearsSchema = z.object({
	search: z.string().optional(),
	status: z.nativeEnum(FiscalYearStatus).optional(),
	sortBy: z.string().default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
