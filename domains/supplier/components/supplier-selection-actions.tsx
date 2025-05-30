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
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";
import { SUPPLIER_STATUS_OPTIONS } from "../constants";
import { ArchiveMultipleSuppliersButton } from "../features/archive-multiple-suppliers";
import { DeleteMultipleSuppliersButton } from "../features/delete-multiple-suppliers";
import { RestoreMultipleSuppliersButton } from "../features/restore-multiple-suppliers";
import { UpdateMultipleSupplierStatusButton } from "../features/update-multiple-supplier-status";

interface SupplierSelectionActionsProps {
	selectedSupplierIds: string[];
	isArchived?: boolean;
}

export function SupplierSelectionActions({
	selectedSupplierIds,
	isArchived,
}: SupplierSelectionActionsProps) {
	return (
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
				{!isArchived ? (
					<>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<span>Changer le statut</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{SUPPLIER_STATUS_OPTIONS.map((status) => (
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
													Changer le statut de {selectedSupplierIds.length}{" "}
													fournisseur(s)
												</AlertDialogTitle>
												<AlertDialogDescription>
													Vous êtes sur le point de changer le statut de{" "}
													{selectedSupplierIds.length} fournisseur(s) en &apos;
													{status.label}
													&apos;.
													<br />
													Cette action est réversible.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Annuler</AlertDialogCancel>
												<UpdateMultipleSupplierStatusButton
													ids={selectedSupplierIds}
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
									<span>Archiver</span>
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="text-destructive">
										Êtes-vous sûr de vouloir archiver ces fournisseurs ?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Cette action va archiver {selectedSupplierIds.length}{" "}
										fournisseur(s).
										<br />
										Vous pourrez les restaurer ultérieurement.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<ArchiveMultipleSuppliersButton ids={selectedSupplierIds}>
										<AlertDialogAction>Archiver</AlertDialogAction>
									</ArchiveMultipleSuppliersButton>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				) : (
					<>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<span>Restaurer</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{SUPPLIER_STATUS_OPTIONS.map((status) => (
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
													Restaurer {selectedSupplierIds.length} fournisseur(s)
												</AlertDialogTitle>
												<AlertDialogDescription>
													Vous êtes sur le point de restaurer{" "}
													{selectedSupplierIds.length} fournisseur(s) archivé(s)
													en &apos;
													{status.label}&apos;.
													<br />
													Cette action est réversible.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Annuler</AlertDialogCancel>
												<RestoreMultipleSuppliersButton
													ids={selectedSupplierIds}
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
										Cette action va supprimer définitivement{" "}
										{selectedSupplierIds.length} fournisseur(s) archivé(s).
										<br />
										Cette action est irréversible.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<DeleteMultipleSuppliersButton ids={selectedSupplierIds}>
										<AlertDialogAction>Supprimer</AlertDialogAction>
									</DeleteMultipleSuppliersButton>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
