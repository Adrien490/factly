import { SUPPLIER_STATUS_OPTIONS } from "@/domains/supplier/constants";
import { DeleteSupplierButton } from "@/domains/supplier/features/delete-supplier/components/delete-supplier-button";
import { RestoreSupplierButton } from "@/domains/supplier/features/restore-supplier";
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
	LoadingIndicator,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { SupplierStatus } from "@prisma/client";
import { FileText, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { GetSuppliersReturn } from "../features/get-suppliers/types";

interface ArchivedSupplierActionsProps {
	supplier: GetSuppliersReturn["suppliers"][number];
}

export function ArchivedSupplierActions({
	supplier,
}: ArchivedSupplierActionsProps) {
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
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${supplier.organizationId}/suppliers/${supplier.id}`}
						className={cn("flex w-full items-center")}
					>
						<FileText className="h-4 w-4 mr-2" />
						<span>Fiche fournisseur</span>
						<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Restaurer</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{SUPPLIER_STATUS_OPTIONS.filter(
							(status) => status.value !== SupplierStatus.ARCHIVED
						).map((status) => (
							<DropdownMenuItem
								className="p-0"
								preventDefault
								key={status.value}
							>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer w-full">
											<div
												className="h-2 w-2 rounded-full"
												style={{ backgroundColor: status.color }}
											/>
											<span>{status.label}</span>
										</div>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Restaurer le fournisseur en {status.label.toLowerCase()}
											</AlertDialogTitle>
											<AlertDialogDescription>
												Cette action va restaurer le fournisseur
												{supplier.name && <strong> {supplier.name}</strong>} en
												statut {status.label.toLowerCase()}.
												<br />
												Cette action est réversible.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Annuler</AlertDialogCancel>
											<RestoreSupplierButton
												organizationId={supplier.organizationId}
												id={supplier.id}
												status={status.value}
											>
												<AlertDialogAction>Restaurer</AlertDialogAction>
											</RestoreSupplierButton>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem
					className="text-destructive focus:text-destructive p-0"
					preventDefault
				>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div className="flex items-center px-2 py-1.5 w-full">
								<span>Supprimer définitivement</span>
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-destructive">
									Êtes-vous sûr de vouloir supprimer définitivement ce
									fournisseur ?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action va supprimer définitivement le fournisseur
									{supplier.name && <strong> {supplier.name}</strong>}.
									<br />
									Cette action est irréversible.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<DeleteSupplierButton
									organizationId={supplier.organizationId}
									id={supplier.id}
								>
									<AlertDialogAction>Supprimer</AlertDialogAction>
								</DeleteSupplierButton>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
