"use client";

import { DataTable } from "@/shared/components/datatable";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use } from "react";
import { ClientExpanded } from "./components";
import { columns } from "./constants/columns";
import { ClientListProps } from "./types";
// Mapping des variants de Badge pour les statuts client

export function ClientDatatable({ clientsPromise }: ClientListProps) {
	const response = use(clientsPromise);
	const { clients, pagination } = response;
	const params = useParams();
	const organizationId = params.organizationId as string;

	if (!clients.length) {
		return (
			<EmptyState
				icon={UserPlus}
				title="Aucun client trouvé"
				description="Vous pouvez créer un client en cliquant sur le bouton ci-dessous"
				action={
					<Button asChild size="default">
						<Link href={`/dashboard/${organizationId}/clients/new`}>
							Nouveau client
						</Link>
					</Button>
				}
			/>
		);
	}

	return (
		<Card>
			<DataTable
				data={clients}
				columns={columns}
				pagination={pagination}
				collapsible={{
					key: "expanded",
					content: (client) => {
						return <ClientExpanded client={client} />;
					},
				}}
				selection={{ key: "clientId" }}
			/>
		</Card>
	);
}
