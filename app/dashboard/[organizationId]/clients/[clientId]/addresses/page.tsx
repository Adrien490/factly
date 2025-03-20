import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import getClient from "@/features/clients/queries/get-client";
import Link from "next/link";

type Props = {
	params: Promise<{
		clientId: string;
		organizationId: string;
	}>;
};

export default async function ClientAddressesPage({ params }: Props) {
	const resolvedParams = await params;
	const { clientId, organizationId } = resolvedParams;
	const client = await getClient({ id: clientId, organizationId });

	console.log(client);

	return (
		<PageContainer>
			<PageHeader
				title="Adresses"
				description="Gérez les adresses du client"
				action={
					<Link
						href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
					>
						<Button>Ajouter une adresse</Button>
					</Link>
				}
			/>
		</PageContainer>
	);
}
