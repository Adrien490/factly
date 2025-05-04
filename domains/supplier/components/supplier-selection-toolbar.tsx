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
import { SupplierStatus } from "@prisma/client";
import { MoreVerticalIcon, Tag, Trash, Undo } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { SUPPLIER_STATUSES } from "../constants";
import { ArchiveMultipleSuppliersButton } from "../features/archive-multiple-suppliers";
import { DeleteMultipleSuppliersButton } from "../features/delete-multiple-suppliers/components/delete-multiple-suppliers-button";
import { RestoreMultipleSuppliersButton } from "../features/restore-multiple-suppliers";
import { UpdateMultipleSupplierStatusButton } from "../features/update-multiple-supplier-status";

export function SupplierSelectionToolbar() {
	const { getSelectedCount, selectedItems, clearAll } = useSelectionContext();
	const params = useParams();
	const searchParams = useSearchParams();
	const organizationId = params.organizationId as string;
	const selectedCount = getSelectedCount();
	const hasSelection = selectedCount > 0;
	const isArchivedView = searchParams.get("status") === SupplierStatus.ARCHIVED;

	if (!hasSelection) {
		return null;
	}

	// Pour la sélection multiple, nous autorisons tous les statuts sauf ARCHIVED
	// car nous ne pouvons pas vérifier le statut actuel de chaque fournisseur
	const availableStatuses = SUPPLIER_STATUSES.filter(
		(status) => status.value !== SupplierStatus.ARCHIVED
	);

	// Fonction pour vérifier si un statut est disponible pour au moins un fournisseur
	const isStatusAvailable = (status: SupplierStatus) => {
		// Pour la sélection multiple, on considère qu'un statut est disponible
		// s'il est différent de ARCHIVED
		return status !== SupplierStatus.ARCHIVED;
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
															Changer le statut de {selectedCount}{" "}
															fournisseur(s)
														</AlertDialogTitle>
														<AlertDialogDescription>
															Vous êtes sur le point de changer le statut de{" "}
															{selectedCount} fournisseur(s) en &apos;
															{status.label}
															&apos;.
															<br />
															Cette action est réversible.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Annuler</AlertDialogCancel>
														<UpdateMultipleSupplierStatusButton
															organizationId={organizationId}
															ids={selectedItems}
															status={status.value}
														>
															<AlertDialogAction>Confirmer</AlertDialogAction>
														</UpdateMultipleSupplierStatusButton>
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
											Êtes-vous sûr de vouloir archiver ces fournisseurs ?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Cette action va archiver {selectedCount} fournisseur(s).
											<br />
											Vous pourrez les restaurer ultérieurement.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Annuler</AlertDialogCancel>
										<ArchiveMultipleSuppliersButton
											organizationId={organizationId}
											ids={selectedItems}
										>
											<AlertDialogAction>Archiver</AlertDialogAction>
										</ArchiveMultipleSuppliersButton>
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
															Restaurer {selectedCount} fournisseur(s)
														</AlertDialogTitle>
														<AlertDialogDescription>
															Vous êtes sur le point de restaurer{" "}
															{selectedCount} fournisseur(s) archivé(s) en
															&apos;
															{status.label}&apos;.
															<br />
															Cette action est réversible.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Annuler</AlertDialogCancel>
														<RestoreMultipleSuppliersButton
															organizationId={organizationId}
															ids={selectedItems}
															status={status.value}
														>
															<AlertDialogAction>Restaurer</AlertDialogAction>
														</RestoreMultipleSuppliersButton>
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
											fournisseurs ?
										</AlertDialogTitle>
										<AlertDialogDescription>
											Cette action va supprimer définitivement {selectedCount}{" "}
											fournisseur(s) archivé(s).
											<br />
											Cette action est irréversible.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Annuler</AlertDialogCancel>
										<DeleteMultipleSuppliersButton
											organizationId={organizationId}
											ids={selectedItems}
										>
											<AlertDialogAction>Supprimer</AlertDialogAction>
										</DeleteMultipleSuppliersButton>
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
