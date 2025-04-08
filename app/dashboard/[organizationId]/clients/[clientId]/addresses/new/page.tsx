import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { clientBreadcrumbs } from "../../constants/client-breadcrumbs";

type Props = {
	params: Promise<{
		clientId: string;
		organizationId: string;
	}>;
};

export default async function NewAddressPage({ params }: Props) {
	const resolvedParams = await params;
	const { clientId, organizationId } = resolvedParams;

	return (
		<PageContainer>
			<PageHeader
				title="Nouvelle adresse"
				description="Ajoutez une nouvelle adresse pour votre client"
				breadcrumbs={clientBreadcrumbs(organizationId, clientId)}
			/>
		</PageContainer>
	);
}
