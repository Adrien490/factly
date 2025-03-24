import { ClientStatus } from "@prisma/client";

export const STATUS_VARIANTS: Record<
	ClientStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	[ClientStatus.LEAD]: "secondary",
	[ClientStatus.PROSPECT]: "default",
	[ClientStatus.ACTIVE]: "default",
	[ClientStatus.INACTIVE]: "outline",
	[ClientStatus.ARCHIVED]: "destructive",
};
