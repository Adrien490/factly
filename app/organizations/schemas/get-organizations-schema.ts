import { z } from "zod";

export const getOrganizationsSchema = z.object({
	sortBy: z
		.enum(["createdAt", "name", "siren", "vatNumber"])
		.default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetOrganizationsParams = z.infer<typeof getOrganizationsSchema>;

export default getOrganizationsSchema;
