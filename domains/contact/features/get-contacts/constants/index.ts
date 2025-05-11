import { Prisma } from "@prisma/client";

export const GET_CONTACTS_DEFAULT_SELECT = {
	id: true,
	firstName: true,
	lastName: true,
	email: true,
	phoneNumber: true,
	mobileNumber: true,
	faxNumber: true,
	website: true,
	function: true,
	civility: true,
	isDefault: true,
	createdAt: true,
	updatedAt: true,
	clientId: true,
	supplierId: true,
} satisfies Prisma.ContactSelect;

export const GET_CONTACTS_DEFAULT_SORT_BY = "createdAt";

export const GET_CONTACTS_DEFAULT_SORT_ORDER = "desc";

export const GET_CONTACTS_SORT_FIELDS = [
	"createdAt",
	"firstName",
	"lastName",
] as const;
