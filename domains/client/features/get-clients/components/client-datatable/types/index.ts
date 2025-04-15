import { GetClientsReturn } from "@/domains/client";

export interface ClientDataTableProps {
	clientsPromise: Promise<GetClientsReturn>;
}
