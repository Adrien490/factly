import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";

type Props = {
	params: Promise<{
		clientId: string;
		organizationId: string;
	}>;
};

export default async function ClientAddressesNewPage({ params }: Props) {
	const resolvedParams = await params;
	const { clientId, organizationId } = resolvedParams;

	console.log(clientId, organizationId);
	return (
		<PageContainer>
			<PageHeader
				title="Ajouter une adresse"
				description="Ajoutez une adresse pour le client"
			/>
		</PageContainer>
	);
}
