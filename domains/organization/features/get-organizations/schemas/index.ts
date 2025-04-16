import { z } from "zod";
import { ORGANIZATION_SORTABLE_FIELDS } from "../constants";

/**
 * Schéma de validation pour la récupération des organisations
 */
export const getOrganizationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z.enum(ORGANIZATION_SORTABLE_FIELDS).optional().default("name"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
	page: z.number().int().positive().optional().default(1),
	perPage: z.number().int().positive().optional().default(10),
	filters: z.record(z.string().or(z.array(z.string()))).optional(),
});
