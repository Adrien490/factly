import { ClientType } from "@prisma/client";

export interface ClientTypeOption {
	value: ClientType;
	label: string;
	description: string;
}
