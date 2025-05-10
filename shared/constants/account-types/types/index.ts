import { AccountType } from "@prisma/client";

export type AccountTypeOption = {
	value: AccountType;
	label: string;
	description: string;
};
