import { z } from "zod";
import ORGANIZATION_SORTABLE_FIELDS from "../../lib/organization-sortable-fields";

/**
 * Schéma de validation pour la récupération des organisations
 * Sans pagination car demandé
 */
export const getOrganizationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z.enum(ORGANIZATION_SORTABLE_FIELDS).optional().default("name"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});
