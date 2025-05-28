import { getClient } from "@/domains/client/features/get-client";
import { UpdateClientForm } from "@/domains/client/features/update-client";
import NotFound from "../../../../not-found";

type PageProps = {
	params: Promise<{
		clientId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const { clientId } = await params;

	const client = await getClient({ id: clientId });

	if (!client) {
		return <NotFound />;
	}

	return <UpdateClientForm client={client} />;
}
