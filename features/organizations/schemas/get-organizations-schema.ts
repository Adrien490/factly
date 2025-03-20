import ORGANIZATION_SORTABLE_FIELDS from "@/features/organizations/lib/organization-sortable-fields";
import { z } from "zod";

const GetOrganizationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z.enum(ORGANIZATION_SORTABLE_FIELDS).optional().default("name"),
	sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

export type GetOrganizationsParams = z.infer<typeof GetOrganizationsSchema>;

export default GetOrganizationsSchema;
