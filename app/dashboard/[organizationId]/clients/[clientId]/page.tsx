import { getClient } from "@/features/client";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { notFound } from "next/navigation";
import { clientNavigation } from "./constants";
import { clientBreadcrumbs } from "./constants/client-breadcrumbs";

type Props = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	const client = await getClient({ id: clientId, organizationId });

	if (!client) {
		return notFound();
	}

	return (
		<PageContainer>
			<PageHeader
				breadcrumbs={clientBreadcrumbs(organizationId, clientId)}
				navigation={{
					items: clientNavigation(organizationId, clientId),
				}}
				title={`Fiche client`}
				description={client.name}
			/>
		</PageContainer>
	);
}
