"use client";

import { useDeleteClient } from "@/features/clients/delete";
import { GetClientsReturn } from "@/features/clients/get-list";
import { MenuActions } from "@/shared/components/menu-actions";
import { ServerActionStatus } from "@/shared/types/server-action";
import { EyeIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";

type Props = {
	client: GetClientsReturn["clients"][number];
};

export function RowActions({ client }: Props) {
	const { state, action, isPending } = useDeleteClient();

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
						onClick: () => action(new FormData()),
						icon: <Trash2Icon className="h-4 w-4" />,
						variant: "destructive",
						disabled: state.status === ServerActionStatus.PENDING,
					},
				]}
			/>
		</div>
	);
}
