import { Civility } from "@prisma/client";

export type CivilityType = Civility;

export interface CivilityOption {
	value: Civility;
	label: string;
	description: string;
}
