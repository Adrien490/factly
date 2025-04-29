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
import { MoreVerticalIcon, Tag, Trash, Undo } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { CLIENT_STATUSES } from "../constants";
import { ArchiveMultipleClientsButton } from "../features/archive-multiple-clients/components/archive-multiple-clients-button";
import { DeleteMultipleClientsButton } from "../features/delete-multiple-clients/components/delete-multiple-clients-button";
import { UpdateMultipleClientStatusButton } from "../features/update-multiple-client-status";

export function ClientSelectionToolbar() {
	const { getSelectedCount, selectedItems, clearAll } = useSelectionContext();
	const params = useParams();
	const searchParams = useSearchParams();
	const organizationId = params.organizationId as string;
	const selectedCount = getSelectedCount();
	const hasSelection = selectedCount > 0;
	const isArchivedView = searchParams.get("status") === ClientStatus.ARCHIVED;

	if (!hasSelection) {
		return null;
	}

	// Pour la sélection multiple, nous autorisons tous les statuts sauf ARCHIVED
	// car nous ne pouvons pas vérifier le statut actuel de chaque client
	const availableStatuses = CLIENT_STATUSES.filter(
		(status) => status.value !== ClientStatus.ARCHIVED
	);

	// Fonction pour vérifier si un statut est disponible pour au moins un client
	const isStatusAvailable = (status: ClientStatus) => {
		// Pour la sélection multiple, on considère qu'un statut est disponible
		// s'il est différent de ARCHIVED
		return status !== ClientStatus.ARCHIVED;
	};

	return (
		<SelectionToolbar selectedCount={selectedCount} clearSelection={clearAll}>
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
					{!isArchivedView && (
						<>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Tag className="h-4 w-4 mr-2" />
									<span>Changer le statut</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									{availableStatuses
										.filter((status) => isStatusAvailable(status.value))
										.map((status) => (
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
															{selectedCount} client(s) en &apos;{status.label}
															&apos;.
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
										<ArchiveMultipleClientsButton
											organizationId={organizationId}
											ids={selectedItems}
										>
											<AlertDialogAction>Archiver</AlertDialogAction>
										</ArchiveMultipleClientsButton>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					)}
					{isArchivedView && (
						<>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Undo className="h-4 w-4 mr-2" />
									<span>Restaurer</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									{availableStatuses
										.filter((status) => isStatusAvailable(status.value))
										.map((status) => (
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
															Restaurer {selectedCount} client(s)
														</AlertDialogTitle>
														<AlertDialogDescription>
															Vous êtes sur le point de restaurer{" "}
															{selectedCount} client(s) archivé(s) en &apos;
															{status.label}&apos;.
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
															<AlertDialogAction>Restaurer</AlertDialogAction>
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
										<span>Supprimer définitivement</span>
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle className="text-destructive">
											Êtes-vous sûr de vouloir supprimer définitivement ces
											clients ?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Cette action va supprimer définitivement {selectedCount}{" "}
											client(s) archivé(s).
											<br />
											Cette action est irréversible.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Annuler</AlertDialogCancel>
										<DeleteMultipleClientsButton
											organizationId={organizationId}
											ids={selectedItems}
										>
											<AlertDialogAction>Supprimer</AlertDialogAction>
										</DeleteMultipleClientsButton>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</SelectionToolbar>
	);
}
