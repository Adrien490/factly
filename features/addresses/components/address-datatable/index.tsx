"use client";

import { GetAddressesReturn } from "@/features/addresses/get-list/types";
import { DataTable } from "@/shared/components/datatable";
import { EmptyState } from "@/shared/components/empty-state/components/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { PlusCircle } from "lucide-react";
import { use } from "react";
import { columns } from "./constants/columns";

interface AddressesDataTableProps {
	addressesPromise: Promise<GetAddressesReturn>;
	onCreateClick?: () => void;
}

export function AddressDataTable({
	addressesPromise,
	onCreateClick,
}: AddressesDataTableProps) {
	const addresses = use(addressesPromise);

	if (!addresses.length) {
		return (
			<EmptyState
				icon={PlusCircle}
				title="Aucune adresse trouvée"
				description="Vous pouvez créer une adresse en cliquant sur le bouton ci-dessous"
				action={
					onCreateClick && (
						<Button onClick={onCreateClick} size="default">
							Nouvelle adresse
						</Button>
					)
				}
			/>
		);
	}

	return (
		<Card>
			<DataTable
				data={addresses}
				columns={columns}
				selection={{ key: "addressId" }}
				ariaLabel="Liste des adresses"
			/>
		</Card>
	);
}
