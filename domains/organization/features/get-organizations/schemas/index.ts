import { OrganizationStatus } from "@prisma/client";
import { z } from "zod";
import { ORGANIZATION_SORTABLE_FIELDS } from "../constants";
/**
 * Schéma de validation pour la récupération des organisations
 * Sans pagination car demandé
 */
export const getOrganizationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z
		.enum(ORGANIZATION_SORTABLE_FIELDS)
		.optional()
		.default("companyName"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
	status: z
		.nativeEnum(OrganizationStatus)
		.optional()
		.nullable()
		.default(OrganizationStatus.ACTIVE),
});
