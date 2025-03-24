export const clientSortableFields = [
	"createdAt",
	"name",
	"email",
	"reference",
	"status",
] as ["createdAt", ...string[]];

// Type pour les champs triables
export type ClientSortableField = (typeof clientSortableFields)[number];
