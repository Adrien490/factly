import { Civility } from "@prisma/client";

export const CIVILITIES = [
	{
		value: Civility.MR,
		label: "Monsieur",
	},
	{
		value: Civility.MRS,
		label: "Madame",
	},
	{
		value: Civility.MS,
		label: "Mademoiselle",
	},
] as const;
