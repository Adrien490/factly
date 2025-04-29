export * from "./supplier-sort-fields";
export * from "./supplier-statuses";
export * from "./supplier-types";

export const supplierSortableFields = [
	"createdAt",
	"name",
	"email",
	"reference",
	"status",
	"supplierType",
] as const;
