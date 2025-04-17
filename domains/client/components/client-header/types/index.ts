import { GetClientReturn } from "@/domains/client/features";

export interface ClientHeaderProps {
	clientPromise: Promise<GetClientReturn>;
}
