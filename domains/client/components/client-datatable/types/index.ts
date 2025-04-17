import { GetClientsReturn } from "@/domains/client/features/get-clients";

export interface ClientDataTableProps {
	clientsPromise: Promise<GetClientsReturn>;
}
