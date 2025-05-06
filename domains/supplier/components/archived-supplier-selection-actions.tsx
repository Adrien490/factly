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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/shared/components";
import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon, Trash, Undo } from "lucide-react";
import { SUPPLIER_STATUSES } from "../constants";
import { DeleteMultipleSuppliersButton } from "../features/delete-multiple-suppliers";
import { RestoreMultipleSuppliersButton } from "../features/restore-multiple-suppliers";

interface ArchivedSupplierSelectionActionsProps {
	selectedSupplierIds: string[];
	organizationId: string;
}

export function ArchivedSupplierSelectionActions({
	selectedSupplierIds,
	organizationId,
}: ArchivedSupplierSelectionActionsProps) {
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
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Undo className="h-4 w-4 mr-2" />
						<span>Restaurer</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{SUPPLIER_STATUSES.map((status) => (
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
											{selectedSupplierIds.length} fournisseur(s) archivé(s) en
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
								Cette action va supprimer définitivement{" "}
								{selectedSupplierIds.length} fournisseur(s) archivé(s).
								<br />
								Cette action est irréversible.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<DeleteMultipleSuppliersButton
								organizationId={organizationId}
								ids={selectedSupplierIds}
							>
								<AlertDialogAction>Supprimer</AlertDialogAction>
							</DeleteMultipleSuppliersButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
