import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import getClient from "../../../../../../features/clients/queries/get-client";

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

	const breadcrumbs = [
		{ label: "Dashboard", href: `/dashboard/${organizationId}` },
		{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
		{
			label: client.name,
			href: `/dashboard/${organizationId}/clients/${client.id}`,
		},
		{
			label: "Modifier",
			href: `/dashboard/${organizationId}/clients/${client.id}/edit`,
		},
	];

	return (
		<div className="flex flex-col gap-8">
			{/* En-tête */}
			<div className="flex flex-col gap-4">
				<PageHeader
					title={`Modifier ${client.name}`}
					breadcrumbs={breadcrumbs}
					description="Modifiez les informations du client ci-dessous"
				/>
				<Separator />
			</div>
		</div>
	);
}
