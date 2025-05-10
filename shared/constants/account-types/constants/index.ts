import { AccountType } from "@prisma/client";
import { AccountTypeOption } from "../types";

export const ACCOUNT_TYPES: AccountTypeOption[] = [
	{
		value: AccountType.CLIENTS,
		label: "411000 - Clients",
		description: "Compte clients",
	},
	{
		value: AccountType.SUPPLIERS,
		label: "401000 - Fournisseurs",
		description: "Compte fournisseurs",
	},
	{
		value: AccountType.PRODUCTS,
		label: "200000 - Produits",
		description: "Compte produits",
	},
];
