import { ClientStatus } from "@prisma/client";

export const CLIENT_STATUS_TRANSITIONS: Record<ClientStatus, ClientStatus[]> = {
	[ClientStatus.LEAD]: [ClientStatus.PROSPECT, ClientStatus.ARCHIVED],
	[ClientStatus.PROSPECT]: [
		ClientStatus.LEAD,
		ClientStatus.ACTIVE,
		ClientStatus.ARCHIVED,
	],
	[ClientStatus.ACTIVE]: [ClientStatus.INACTIVE, ClientStatus.ARCHIVED],
	[ClientStatus.INACTIVE]: [ClientStatus.ACTIVE, ClientStatus.ARCHIVED],
	[ClientStatus.ARCHIVED]: [
		ClientStatus.LEAD,
		ClientStatus.PROSPECT,
		ClientStatus.ACTIVE,
		ClientStatus.INACTIVE,
	],
};
