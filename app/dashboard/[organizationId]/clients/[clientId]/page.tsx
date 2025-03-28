import { getClient } from "@/features/client";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
import { notFound } from "next/navigation";

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
				breadcrumbs={[
					{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
					{
						label: client.name,
						href: `/dashboard/${organizationId}/clients/${clientId}`,
					},
				]}
				navigation={{
					items: [
						{
							label: "Fiche client",
							href: `/dashboard/${organizationId}/clients/${clientId}`,
						},
						{
							label: "Modifier",
							href: `/dashboard/${organizationId}/clients/${clientId}/edit`,
						},
						{
							label: "Gestion des adresses",
							href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
						},
						{
							label: "Gestion des contacts",
							href: `/dashboard/${organizationId}/clients/${clientId}/contacts`,
						},
						{
							label: "Supprimer",
							href: `/dashboard/${organizationId}/clients/${clientId}/delete`,
						},
					],
				}}
				title={`Fiche client`}
				description={client.name}
			/>
			<div>
				Client {clientId} of organization {organizationId}
			</div>
		</PageContainer>
	);
}
