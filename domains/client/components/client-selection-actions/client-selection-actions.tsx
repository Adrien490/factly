"use client";

import { useDeleteClient } from "@/domains/client/features/delete-client";
import { MenuActions } from "@/shared/components/menu-actions";
import { ServerActionStatus } from "@/shared/types/server-action";
import { Trash2Icon } from "lucide-react";

export function ClientSelectionActions() {
	const { state, action, isPending } = useDeleteClient();

	return (
		<div data-pending={isPending ? "" : undefined}>
			<MenuActions
				actions={[
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
