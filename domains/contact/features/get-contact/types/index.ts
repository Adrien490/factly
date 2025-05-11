import { Prisma } from "@prisma/client";
import { GET_CONTACT_DEFAULT_SELECT } from "../constants";

export type GetContactReturn = Prisma.ContactGetPayload<{
	select: typeof GET_CONTACT_DEFAULT_SELECT;
}> | null;
