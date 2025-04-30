import { SUPPLIER_STATUSES } from "@/domains/supplier/constants";
import { SUPPLIER_STATUS_TRANSITIONS } from "@/domains/supplier/constants/supplier-status-transitions";
import { DeleteSupplierButton } from "@/domains/supplier/features/delete-supplier/components/delete-supplier-button";
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
	Archive,
	Edit2,
	FileText,
	MoreVerticalIcon,
	Tag,
	Trash,
	Undo,
	Users,
} from "lucide-react";
import Link from "next/link";
import { GetSuppliersReturn } from "../../../types";

interface SupplierRowActionsProps {
	supplier: GetSuppliersReturn["suppliers"][number];
}

export function SupplierRowActions({ supplier }: SupplierRowActionsProps) {
	const isArchived = supplier.status === SupplierStatus.ARCHIVED;

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
				{!isArchived && (
					<>
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
								<span>Gérer les contacts</span>
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
										SUPPLIER_STATUS_TRANSITIONS[supplier.status].includes(
											status.value
										)
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
									<Archive className="text-destructive h-4 w-4 mr-2" />
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
					</>
				)}
				{isArchived && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Undo className="h-4 w-4 mr-2" />
								<span>Restaurer</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{SUPPLIER_STATUSES.filter(
									(status) => status.value !== SupplierStatus.ARCHIVED
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
													Restaurer le fournisseur en{" "}
													{status.label.toLowerCase()}
												</AlertDialogTitle>
												<AlertDialogDescription>
													Cette action va restaurer le fournisseur
													{supplier.name && (
														<strong> {supplier.name}</strong>
													)}{" "}
													en statut {status.label.toLowerCase()}.
													<br />
													Cette action est réversible.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Annuler</AlertDialogCancel>
												<UpdateSupplierStatusButton
													organizationId={supplier.organizationId}
													id={supplier.id}
													status={status.value}
												>
													<AlertDialogAction>Restaurer</AlertDialogAction>
												</UpdateSupplierStatusButton>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
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
									<span>Supprimer définitivement</span>
								</DropdownMenuItem>
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
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
