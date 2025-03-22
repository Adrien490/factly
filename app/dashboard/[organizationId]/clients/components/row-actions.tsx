"use client";

import { GetClientsReturn } from "@/features/clients/queries/get-clients";
import { MenuActions } from "@/shared/components/menu-actions";
import { EyeIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useClients } from "../hooks/use-clients";
type Props = {
	client: GetClientsReturn["clients"][number];
};

export default function RowActions({ client }: Props) {
	const { handleDelete, isPending } = useClients();

	return (
		<div data-pending={isPending ? "" : undefined}>
			<MenuActions
				actions={[
					{
						label: "Voir",
						href: `/dashboard/${client.organizationId}/clients/${client.id}`,
						icon: <EyeIcon className="h-4 w-4" />,
					},
					{
						label: "Modifier",
						href: `/dashboard/${client.organizationId}/clients/${client.id}/edit`,
						icon: <PencilIcon className="h-4 w-4" />,
						divider: true,
					},
					{
						label: "Gestion des adresses",
						href: `/dashboard/${client.organizationId}/clients/${client.id}/addresses`,
						icon: <MapPinIcon className="h-4 w-4" />,
					},

					{
						label: "Supprimer",
						onClick: () => handleDelete(client.id),
						icon: <Trash2Icon className="h-4 w-4" />,
						variant: "destructive",
						disabled: isPending,
					},
				]}
			/>
		</div>
	);
}
