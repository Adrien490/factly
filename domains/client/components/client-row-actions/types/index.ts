import { GetClientsReturn } from "@/domains/client";

export interface ClientRowActionsProps {
	client: GetClientsReturn["clients"][number];
}
