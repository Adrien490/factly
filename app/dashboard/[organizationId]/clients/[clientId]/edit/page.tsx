import {
	ClientHeader,
	ClientHeaderSkeleton,
	getClient,
} from "@/domains/client/features/get-client";
import { UpdateClientForm } from "@/domains/client/features/update-client";
import { PageContainer } from "@/shared/components";
import { Suspense } from "react";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const { organizationId, clientId } = await params;

	const client = await getClient({ id: clientId, organizationId });

	if (!client) {
		return <NotFound />;
	}

	return (
		<PageContainer className="pt-4 pb-12">
			{/* Breadcrumb amélioré */}

			{/* En-tête client */}

			<Suspense fallback={<ClientHeaderSkeleton />}>
				<ClientHeader client={client} />
			</Suspense>

			{/* Contenu de la page */}
			<UpdateClientForm client={client} />
		</PageContainer>
	);
}
