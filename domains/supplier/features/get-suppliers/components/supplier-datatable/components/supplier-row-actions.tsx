import { SUPPLIER_STATUSES } from "@/domains/supplier/constants";
import { UpdateSupplierStatusButton } from "@/domains/supplier/features/update-supplier-status/components/update-supplier-status-button";
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
import {
	Edit2,
	FileText,
	MoreVerticalIcon,
	Tag,
	Trash,
	Users,
} from "lucide-react";
import Link from "next/link";
import { GetSuppliersReturn } from "../../../types";

interface SupplierRowActionsProps {
	supplier: GetSuppliersReturn["suppliers"][number];
}

export function SupplierRowActions({ supplier }: SupplierRowActionsProps) {
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
						{/* Indicateur de chargement masqué par défaut */}
						<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/edit`}
						className={cn("flex w-full items-center")}
					>
						<Edit2 className="h-4 w-4 mr-2" />
						<span>Modifier</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/contacts`}
						className={cn("flex w-full items-center")}
					>
						<Users className="h-4 w-4 mr-2" />
						<span>Gestion des contacts</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Tag className="h-4 w-4 mr-2" />
						<span>Changer le statut</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{SUPPLIER_STATUSES.filter(
							(status) =>
								status.value !== SupplierStatus.ARCHIVED &&
								status.value !== supplier.status
						).map((status) => (
							<UpdateSupplierStatusButton
								key={status.value}
								organizationId={supplier.organizationId}
								id={supplier.id}
								status={status.value}
							>
								<DropdownMenuItem>
									<div className="flex items-center gap-2">
										<div
											className="h-2 w-2 rounded-full"
											style={{ backgroundColor: status.color }}
										/>
										<span>{status.label}</span>
									</div>
								</DropdownMenuItem>
							</UpdateSupplierStatusButton>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
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
							<AlertDialogTitle>Archiver le fournisseur</AlertDialogTitle>
							<AlertDialogDescription>
								Cette action va archiver le fournisseur
								{supplier.name && <strong> {supplier.name}</strong>}.
								<br />
								Vous pourrez le restaurer ultérieurement.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Annuler</AlertDialogCancel>
							<UpdateSupplierStatusButton
								organizationId={supplier.organizationId}
								id={supplier.id}
								status={SupplierStatus.ARCHIVED}
							>
								<AlertDialogAction>Archiver</AlertDialogAction>
							</UpdateSupplierStatusButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
