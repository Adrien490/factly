export * from "./client-statuses";
export * from "./client-types";

export const clientSortableFields = [
	"createdAt",
	"name",
	"email",
	"reference",
	"status",
] as const;
