"use client";

import { MenuActions } from "@/components/menu-actions";
import { useActions } from "@/hooks/use-actions";
import { Client } from "@prisma/client";
import { EyeIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useClients } from "../hooks/use-clients";
type Props = {
	client: Client;
};

export default function ClientActions({ client }: Props) {
	const { deleteState, handleDelete, isPending } = useClients();

	useActions(deleteState);

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
