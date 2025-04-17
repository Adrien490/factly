import { GetClientsReturn } from "@/domains/client/features/get-clients";

export interface ClientRowActionsProps {
	client: GetClientsReturn["clients"][number];
}
