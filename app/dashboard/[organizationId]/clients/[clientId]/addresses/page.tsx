import DataTable from "@/components/datatable";
import PageHeader from "@/components/page-header";
import SearchForm from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import getClient from "../../server/get-client";
import { columns } from "./components/columns";

type PageProps = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientAddressesPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;
	const client = await getClient({ organizationId, id: clientId });
	console.log(client.addresses);

	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				title={`Adresses de ${client.name}`}
				description={`Gestion des adresses du client ${client.name}`}
				breadcrumbs={[
					{ label: "Dashboard", href: `/dashboard` },
					{ label: "Clients", href: `/dashboard/${organizationId}/clients` },
					{
						label: client.name,
						href: `/dashboard/${organizationId}/clients/${clientId}`,
					},
					{
						label: "Adresses",
						href: `/dashboard/${organizationId}/clients/${clientId}/addresses`,
					},
				]}
			/>

			{/* Barre de recherche et filtres */}
			<div className="bg-card p-4 rounded-lg">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col sm:flex-row justify-between gap-4">
						<div className="flex flex-col sm:flex-row items-center gap-4">
							<SearchForm
								paramName="search"
								placeholder="Rechercher une adresse..."
								className="w-full sm:w-[300px]"
							/>
						</div>
						<Link
							href={`/dashboard/${organizationId}/clients/${clientId}/addresses/new`}
							className="shrink-0"
						>
							<Button size="sm" className="w-full">
								<PlusIcon className="h-4 w-4 sm:mr-2" />
								<span className="hidden sm:inline">Ajouter une adresse</span>
								<span className="inline sm:hidden">Ajouter</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Sélection */}
			<div className="flex flex-col gap-4">
				<DataTable columns={columns} data={client.addresses} />
			</div>
		</div>
	);
}
