// features/invitations/lib/invitation-sortable-fields.ts

const INVITATION_SORTABLE_FIELDS = [
	"createdAt",
	"organization.name",
	"status",
	"email",
] as const;

export const INVITATION_SORT_OPTIONS = INVITATION_SORTABLE_FIELDS.map(
	(field) => ({
		label:
			field === "createdAt"
				? "Date d'envoi"
				: field === "organization.name"
				? "Organisation"
				: field === "status"
				? "Statut"
				: field === "email"
				? "Email"
				: field,
		value: field,
	})
);

export type InvitationSortableField =
	(typeof INVITATION_SORTABLE_FIELDS)[number];

export default INVITATION_SORTABLE_FIELDS;
