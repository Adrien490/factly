import { getClient } from "@/domains/client/features/get-client";
import { UpdateClientForm } from "@/domains/client/features/update-client";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	const client = await getClient({ id: clientId, organizationId });

	if (!client) {
		return <NotFound />;
	}

	return <UpdateClientForm client={client} />;
}
