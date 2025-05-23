import { Civility, Prisma } from "@prisma/client";
import { z } from "zod";
import {
	GET_CONTACTS_DEFAULT_SELECT,
	GET_CONTACTS_SORT_FIELDS,
} from "../constants";
import { getContactsSchema } from "../schemas";

export type GetContactsInput = z.infer<typeof getContactsSchema>;

export type ContactWithSelectedFields = {
	id: string;
	firstName: string;
	lastName: string;
	email: string | null;
	phoneNumber: string | null;
	mobileNumber: string | null;
	faxNumber: string | null;
	website: string | null;
	function: string | null;
	civility: Civility | null;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type GetContactsReturn = Array<
	Prisma.ContactGetPayload<{ select: typeof GET_CONTACTS_DEFAULT_SELECT }>
>;

export type GetContactsSortBy = (typeof GET_CONTACTS_SORT_FIELDS)[number];
