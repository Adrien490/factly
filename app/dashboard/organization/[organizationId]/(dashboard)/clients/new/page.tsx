import PageHeader from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import ClientForm from "../components/client-form";

type PageProps = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function NewClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	const breadcrumbs = [
		{ label: "Dashboard", href: `/dashboard/${organizationId}` },
		{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
		{
			label: "Nouveau client",
			href: `/dashboard/${organizationId}/clients/new`,
		},
	];

	return (
		<div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col gap-8">
			{/* En-tête */}
			<div className="flex flex-col gap-4">
				<PageHeader
					title="Nouveau client"
					breadcrumbs={breadcrumbs}
					description="Créez un nouveau client en remplissant les informations ci-dessous"
				/>
				<Separator />
			</div>

			{/* Contenu principal */}

			<ClientForm
				initialValues={{
					organizationId,
					reference: "",
					name: "",
					status: "LEAD",
					clientType: "INDIVIDUAL",
				}}
			/>
		</div>
	);
}
