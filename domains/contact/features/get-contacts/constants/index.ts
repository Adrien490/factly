import { Prisma } from "@prisma/client";

export const MAX_RESULTS_PER_PAGE = 100;
export const DEFAULT_PER_PAGE = 10;

export const GET_CONTACTS_DEFAULT_SELECT = {
	id: true,
	firstName: true,
	lastName: true,
	civility: true,
	function: true,
	email: true,
	phoneNumber: true,
	mobileNumber: true,
	faxNumber: true,
	website: true,
	notes: true,
	isDefault: true,
	createdAt: true,
	updatedAt: true,
	clientId: true,
	supplierId: true,
	client: {
		select: {
			id: true,
			reference: true,
		},
	},
	supplier: {
		select: {
			id: true,
			reference: true,
		},
	},
} as const satisfies Prisma.ContactSelect;

export const GET_CONTACTS_DEFAULT_SORT_BY = "createdAt";
export const GET_CONTACTS_DEFAULT_SORT_ORDER = "desc";

export const GET_CONTACTS_SORT_FIELDS = [
	"firstName",
	"lastName",
	"email",
	"createdAt",
] as const;
