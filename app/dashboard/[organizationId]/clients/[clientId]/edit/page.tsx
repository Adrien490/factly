import ClientForm from "@/app/dashboard/[organizationId]/clients/components/client-form";
import getClient from "@/app/dashboard/[organizationId]/clients/server/get-client";
import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";

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
		<div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col gap-8">
			{/* En-tête */}
			<div className="flex flex-col gap-4">
				<PageHeader
					title={`Modifier ${client.name}`}
					breadcrumbs={breadcrumbs}
					description="Modifiez les informations du client ci-dessous"
				/>
				<Separator />
			</div>

			{/* Contenu principal */}
			<div className="flex flex-col gap-6">
				<div className="rounded-lg border bg-card/50 p-6 shadow-sm">
					<ClientForm
						initialValues={{
							organizationId,
							reference: client.reference,
							name: client.name,
							status: client.status,
							email: client.email ?? undefined,
							phone: client.phone ?? undefined,
							clientType: client.clientType,
							siren: client.siren ?? undefined,
							vatNumber: client.vatNumber ?? undefined,
							legalForm: client.legalForm ?? undefined,
							civility: client.civility ?? undefined,
							website: client.website ?? undefined,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
