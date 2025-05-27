import { Prisma } from "@prisma/client";

export const GET_CONTACT_DEFAULT_SELECT = {
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
