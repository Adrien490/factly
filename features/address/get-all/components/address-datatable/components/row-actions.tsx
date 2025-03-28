"use client";

import { deleteAddress } from "@/features/address";
import { DeleteAddressParams } from "@/features/address/delete/types";
import { GetAddressesReturn } from "@/features/address/get-all/types";
import { updateAddress } from "@/features/address/update";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/features/shared/components/ui/alert-dialog";
import { Button } from "@/features/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Star, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface RowActionsProps {
	address: GetAddressesReturn[number];
}

export function RowActions({ address }: RowActionsProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (address.clientId) {
			router.push(
				`/dashboard/clients/${address.clientId}/addresses/${address.id}/edit`
			);
		} else if (address.supplierId) {
			router.push(
				`/dashboard/suppliers/${address.supplierId}/addresses/${address.id}/edit`
			);
		}
	};

	const handleSetDefault = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (address.isDefault) return;

		startTransition(async () => {
			try {
				await updateAddress({
					id: address.id,
					isDefault: true,
				});

				toast.success("Adresse définie comme adresse principale");
				router.refresh();
			} catch (error) {
				console.error(error);
				toast.error("Erreur lors de la mise à jour de l'adresse");
			}
		});
	};

	const handleDelete = (e?: React.MouseEvent) => {
		if (e) e.stopPropagation();

		startTransition(async () => {
			try {
				const params: DeleteAddressParams = {
					id: address.id,
				};

				const result = await deleteAddress(params);

				if (result.success) {
					toast.success(result.message);
					router.refresh();
				} else {
					toast.error(result.message);
				}
			} catch (error) {
				console.error(error);
				toast.error("Erreur lors de la suppression de l'adresse");
			} finally {
				setIsDeleteDialogOpen(false);
			}
		});
	};

	const openDeleteDialog = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsDeleteDialogOpen(true);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						disabled={isPending}
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Ouvrir le menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={handleEdit}>
						<Edit className="h-4 w-4 mr-2" />
						Modifier
					</DropdownMenuItem>
					{!address.isDefault && (
						<DropdownMenuItem onClick={handleSetDefault}>
							<Star className="h-4 w-4 mr-2" />
							Définir comme principale
						</DropdownMenuItem>
					)}
					<DropdownMenuItem
						className="text-destructive"
						onClick={openDeleteDialog}
					>
						<Trash className="h-4 w-4 mr-2" />
						Supprimer
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Dialog de confirmation de suppression */}
			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action ne peut pas être annulée. Cette adresse sera
							définitivement supprimée.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isPending ? "Suppression..." : "Supprimer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
