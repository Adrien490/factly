"use client";

import { DataTable } from "@/features/shared/components/datatable";
import { EmptyState } from "@/features/shared/components/empty-state/components/empty-state";
import { Button } from "@/features/shared/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { use } from "react";
import { columns } from "../constants/columns";
import { ClientListProps } from "../types";
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
		<DataTable
			data={clients}
			columns={columns}
			pagination={pagination}
			selection={{ key: "clientId" }}
		/>
	);
}
