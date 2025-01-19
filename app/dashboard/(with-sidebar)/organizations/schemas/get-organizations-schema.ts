import { z } from "zod";

export const ORGANIZATION_SORTABLE_FIELDS = [
	"name",
	"siren",
	"siret",
	"createdAt",
	"updatedAt",
] as const;

export const ORGANIZATION_SORT_OPTIONS = ORGANIZATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "updatedAt"
				? "Date de modification"
				: field === "name"
				? "Nom"
				: field === "siren"
				? "SIREN"
				: field === "siret"
				? "SIRET"
				: field,
		value: field,
	})
);

export type OrganizationSortableField =
	(typeof ORGANIZATION_SORTABLE_FIELDS)[number];

const getOrganizationsSchema = z.object({
	search: z.string().optional(),
	sortBy: z.enum(ORGANIZATION_SORTABLE_FIELDS).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type GetOrganizationsParams = z.infer<typeof getOrganizationsSchema>;

export default getOrganizationsSchema;
