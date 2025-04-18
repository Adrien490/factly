import { GetClientsReturn } from "../../../get-clients";

export interface DeleteClientFormProps {
	client: GetClientsReturn["clients"][number];
	trigger?: React.ReactNode;
}
