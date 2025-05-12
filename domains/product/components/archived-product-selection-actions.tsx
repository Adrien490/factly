import { AlertDialogFooter, AlertDialogHeader } from "@/shared/components";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
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
} from "@/shared/components/ui";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon, Trash, Undo } from "lucide-react";
import { PRODUCT_STATUS_OPTIONS } from "../constants";
import { DeleteMultipleProductsButton } from "../features/delete-multiple-products";
import { RestoreMultipleProductsButton } from "../features/restore-multiple-products";

interface ArchivedProductSelectionActionsProps {
	selectedProductIds: string[];
	organizationId: string;
}

export function ArchivedProductSelectionActions({
	selectedProductIds,
	organizationId,
}: ArchivedProductSelectionActionsProps) {
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
						{PRODUCT_STATUS_OPTIONS.map((status) => (
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
											Restaurer {selectedProductIds.length} produit(s)
										</AlertDialogTitle>
										<AlertDialogDescription>
											Vous êtes sur le point de restaurer{" "}
											{selectedProductIds.length} produit(s) archivé(s) en
											&apos;
											{status.label}&apos;.
											<br />
											Cette action est réversible.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Annuler</AlertDialogCancel>
										<RestoreMultipleProductsButton
											organizationId={organizationId}
											ids={selectedProductIds}
											status={status.value}
										>
											<AlertDialogAction>Restaurer</AlertDialogAction>
										</RestoreMultipleProductsButton>
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
								Êtes-vous sûr de vouloir supprimer définitivement ces produits ?
							</AlertDialogTitle>
							<AlertDialogDescription>
								Cette action va supprimer définitivement{" "}
								{selectedProductIds.length} produit(s) archivé(s).
								<br />
								Cette action est irréversible.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<DeleteMultipleProductsButton
								organizationId={organizationId}
								ids={selectedProductIds}
							>
								<AlertDialogAction>Supprimer</AlertDialogAction>
							</DeleteMultipleProductsButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
