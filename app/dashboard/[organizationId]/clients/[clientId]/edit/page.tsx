import { getClient } from "@/features/client/get";
import { UpdateClientForm } from "@/features/client/update/form";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { clientNavigation } from "../constants";

type PageProps = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	// Récupération du client
	const client = await getClient({ id: clientId, organizationId });
	if (!client) {
		notFound();
	}

	return (
		<PageContainer>
			{/* En-tête */}

			<PageHeader
				title={`Modifier ${client.name}`}
				description="Modifiez les informations du client ci-dessous"
				breadcrumbs={[
					{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
					{
						label: client.name,
						href: `/dashboard/${organizationId}/clients/${clientId}`,
					},
				]}
				navigation={{
					items: clientNavigation(organizationId, clientId),
				}}
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<UpdateClientForm
					clientPromise={getClient({ id: clientId, organizationId })}
				/>
			</Suspense>
		</PageContainer>
	);
}
