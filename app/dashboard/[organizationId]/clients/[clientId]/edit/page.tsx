import { getClient } from "@/features/clients/get";
import { PageHeader } from "@/shared/components/page-header";
import { Separator } from "@/shared/components/ui/separator";
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

	return (
		<div className="flex flex-col gap-8">
			{/* En-tête */}
			<div className="flex flex-col gap-4">
				<PageHeader
					title={`Modifier ${client.name}`}
					description="Modifiez les informations du client ci-dessous"
				/>
				<Separator />
			</div>
		</div>
	);
}
