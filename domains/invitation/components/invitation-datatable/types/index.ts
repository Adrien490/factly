import { GetInvitationsReturn } from "@/domains/invitation/features/get-invitations";

export interface InvitationDataTableProps {
	invitationsPromise: Promise<GetInvitationsReturn>;
}
