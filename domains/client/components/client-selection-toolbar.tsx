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
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	SelectionToolbar,
} from "@/shared/components";
import { useSelectionContext } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import { ClientStatus } from "@prisma/client";
import { MoreVerticalIcon, Tag, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { CLIENT_STATUSES } from "../constants/client-statuses/constants";
import { UpdateMultipleClientStatusButton } from "../features/update-multiple-client-status";

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
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<Tag className="h-4 w-4 mr-2" />
							<span>Changer le statut</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							{CLIENT_STATUSES.filter(
								(status) => status.value !== ClientStatus.ARCHIVED
							).map((status) => (
								<AlertDialog key={status.value}>
									<AlertDialogTrigger asChild>
										<DropdownMenuItem preventDefault>
											<div className="flex items-center gap-2">
												<div
													className="h-2 w-2 rounded-full"
													style={{ backgroundColor: status.color }}
												/>
												<span>{status.label}</span>
											</div>
										</DropdownMenuItem>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Changer le statut de {selectedCount} client(s)
											</AlertDialogTitle>
											<AlertDialogDescription>
												Vous êtes sur le point de changer le statut de{" "}
												{selectedCount} client(s) en &apos;{status.label}&apos;.
												<br />
												Cette action est réversible.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Annuler</AlertDialogCancel>
											<UpdateMultipleClientStatusButton
												organizationId={organizationId}
												ids={selectedItems}
												status={status.value}
											>
												<AlertDialogAction>Confirmer</AlertDialogAction>
											</UpdateMultipleClientStatusButton>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							))}
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSeparator />
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<DropdownMenuItem
								preventDefault
								className="text-destructive focus:text-destructive"
							>
								<Trash className="text-destructive h-4 w-4 mr-2" />
								<span>Archiver</span>
							</DropdownMenuItem>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-destructive">
									Êtes-vous sûr de vouloir archiver ces clients ?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action va archiver {selectedCount} client(s).
									<br />
									Vous pourrez les restaurer ultérieurement.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<UpdateMultipleClientStatusButton
									organizationId={organizationId}
									ids={selectedItems}
									status={ClientStatus.ARCHIVED}
								>
									<AlertDialogAction>Archiver</AlertDialogAction>
								</UpdateMultipleClientStatusButton>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuContent>
			</DropdownMenu>
		</SelectionToolbar>
	);
}
