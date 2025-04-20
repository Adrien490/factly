"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	SelectionToolbar,
} from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { DeleteClientsButton } from "../../features/delete-clients";

export function ClientSelectionToolbar() {
	const { getSelectedCount, selectedItems, clearSelection } =
		useSelectionContext();
	const params = useParams();
	const organizationId = params.organizationId as string;
	const selectedCount = getSelectedCount();
	const hasSelection = selectedCount > 0;
	if (!hasSelection) {
		return null;
	}
	return (
		<SelectionToolbar
			selectedCount={selectedCount}
			clearSelection={clearSelection}
		>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
						)}
						aria-label="Menu d'actions"
						type="button"
					>
						<MoreVerticalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					side="bottom"
					sideOffset={4}
					className="w-48"
				>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem
								preventDefault
								className="text-destructive focus:text-destructive"
							>
								<Trash className="text-destructive h-4 w-4 mr-2" />
								<span>Supprimer</span>
							</DropdownMenuItem>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-destructive">
									Êtes-vous sûr de vouloir supprimer ces clients ?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action est irréversible. Cela supprimera définitivement
									les clients
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<DeleteClientsButton
									organizationId={organizationId}
									ids={selectedItems}
								>
									<AlertDialogAction>Supprimer</AlertDialogAction>
								</DeleteClientsButton>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuContent>
			</DropdownMenu>
		</SelectionToolbar>
	);
}
