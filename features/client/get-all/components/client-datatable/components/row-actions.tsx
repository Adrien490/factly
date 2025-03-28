"use client";

import { useDeleteClient } from "@/features/client/delete";
import { GetClientsReturn } from "@/features/client/get-all";
import { MenuActions } from "@/features/shared/components/menu-actions";
import { ServerActionStatus } from "@/features/shared/types/server-action";

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
						label: "Voir la fiche client",
						href: `/dashboard/${client.organizationId}/clients/${client.id}`,
					},
					{
						label: "Modifier",
						href: `/dashboard/${client.organizationId}/clients/${client.id}/edit`,
						divider: true,
					},
					{
						label: "Gestion des adresses",
						href: `/dashboard/${client.organizationId}/clients/${client.id}/addresses`,
					},

					{
						label: "Supprimer",
						onClick: () => action(new FormData()),
						variant: "destructive",
						disabled: state.status === ServerActionStatus.PENDING,
					},
				]}
			/>
		</div>
	);
}
