import { GetClientReturn } from "@/domains/client/features/get-client";

export interface ClientHeaderProps {
	clientPromise: Promise<GetClientReturn>;
}
