"use client";

import { MenuActions } from "@/components/menu-actions";
import { useSelection } from "@/features/selection/hooks/use-selection";
import { Trash2Icon } from "lucide-react";
import { useClients } from "../hooks/use-clients";
import { CLIENT_SELECTION_KEY } from "../lib/constants";

export default function ClientSelectionActions() {
	const { selectedItems } = useSelection(CLIENT_SELECTION_KEY);

	const { handleDelete, isPending } = useClients();

	return (
		<div data-pending={isPending ? "" : undefined}>
			<MenuActions
				actions={[
					{
						label: "Supprimer",
						onClick: () => handleDelete(selectedItems[0]),
						icon: <Trash2Icon className="h-4 w-4" />,
						variant: "destructive",
						disabled: isPending,
					},
				]}
			/>
		</div>
	);
}
