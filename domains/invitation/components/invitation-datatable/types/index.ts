import { GetInvitationsReturn } from "@/domains/invitation/features/get-invitations";
import { User } from "better-auth";

export interface InvitationDataTableProps {
	invitationsPromise: Promise<GetInvitationsReturn>;
	userPromise: Promise<User | null>;
}
