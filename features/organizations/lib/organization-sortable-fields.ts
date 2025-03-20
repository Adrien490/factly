const ORGANIZATION_SORTABLE_FIELDS = ["name", "createdAt"] as const;

export const ORGANIZATION_SORT_OPTIONS = ORGANIZATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date de création"
				: field === "name"
				? "Nom"
				: field,
		value: field,
	})
);

export type OrganizationSortableField =
	(typeof ORGANIZATION_SORTABLE_FIELDS)[number];

export default ORGANIZATION_SORTABLE_FIELDS;
