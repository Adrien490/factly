"use client";

import { deleteAddress } from "@/features/address";
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
	AlertDialogTrigger,
} from "@/features/shared/components/ui/alert-dialog";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/features/shared/components/ui/dropdown-menu";
import { Building, Home, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { AddressCardProps } from "../types";

// Composant pour le badge "Principal"
const DefaultBadge = () => (
	<Badge variant="outline" className="shrink-0 text-xs h-5 px-1.5">
		Principal
	</Badge>
);

export function AddressCard({ address, viewMode = "grid" }: AddressCardProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const {
		id,
		addressLine1,
		addressLine2,
		city,
		postalCode,
		country,
		isDefault,
		clientId,
		supplierId,
	} = address;

	const editHref = clientId
		? `/dashboard/clients/${clientId}/addresses/${id}/edit`
		: supplierId
		? `/dashboard/suppliers/${supplierId}/addresses/${id}/edit`
		: "#";

	const handleSetDefault = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (isDefault) return;

		startTransition(async () => {
			try {
				await updateAddress({ id, isDefault: true });
				toast.success("Adresse définie comme adresse principale");
				router.refresh();
			} catch (error: unknown) {
				console.error(error);
				toast.error("Erreur lors de la mise à jour de l'adresse");
			}
		});
	};

	const handleDelete = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		startTransition(async () => {
			try {
				const result = await deleteAddress({ id });

				if (result.success) {
					toast.success(result.message);
					router.refresh();
				} else {
					toast.error(result.message);
				}
			} catch (error: unknown) {
				console.error(error);
				toast.error("Erreur lors de la suppression de l'adresse");
			}
		});
	};

	// Menu d'actions pour les adresses
	const ActionMenu = () => (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						disabled={isPending}
						onClick={(e) => e.preventDefault()}
						className="h-8 w-8 rounded-full hover:bg-accent"
					>
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Actions</span>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuItem asChild>
						<Link href={editHref} className="cursor-pointer flex items-center">
							Modifier
						</Link>
					</DropdownMenuItem>

					{!isDefault && (
						<DropdownMenuItem
							onClick={handleSetDefault}
							className="cursor-pointer flex items-center"
							disabled={isPending}
						>
							Définir comme principale
						</DropdownMenuItem>
					)}

					<DropdownMenuSeparator />

					<AlertDialogTrigger asChild>
						<DropdownMenuItem
							className="cursor-pointer text-destructive flex items-center focus:text-destructive"
							disabled={isPending}
							onSelect={(e) => e.preventDefault()}
						>
							Supprimer
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

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
	);

	// Rendu en mode liste
	if (viewMode === "list") {
		return (
			<Link href={editHref} className="block">
				<div className="border rounded-lg p-3 transition-all duration-200 hover:bg-accent/30">
					<div className="flex items-center gap-3">
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<h3 className="font-medium truncate">{addressLine1}</h3>
								{isDefault && <DefaultBadge />}
							</div>
							<p className="text-xs text-muted-foreground truncate mt-0.5">
								{postalCode ? postalCode : ""}
								{postalCode && city ? " " : ""}
								{city ? city : ""}
								{(postalCode || city) && country ? " · " : ""}
								{country ? country : ""}
							</p>
						</div>

						<ActionMenu />
					</div>
				</div>
			</Link>
		);
	}

	// Rendu en mode grille
	return (
		<Link href={editHref} className="block h-full">
			<Card className="h-full transition-all duration-200 hover:bg-accent/30">
				<CardContent className="p-4 flex flex-col h-full">
					<div className="flex items-start justify-between">
						<div className="flex items-start gap-3">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<h3 className="font-medium truncate">{addressLine1}</h3>
									{isDefault && <DefaultBadge />}
								</div>
								{addressLine2 && (
									<p className="text-xs text-muted-foreground truncate mt-0.5">
										{addressLine2}
									</p>
								)}
							</div>
						</div>

						<ActionMenu />
					</div>

					<div className="pt-3 mt-auto text-xs text-muted-foreground flex items-center justify-between gap-x-2 gap-y-1">
						<div className="flex items-center gap-2">
							<div>
								{postalCode ? postalCode : ""}
								{postalCode && city ? " " : ""}
								{city ? city : ""}
							</div>
							{country && (
								<span className="text-muted-foreground/70">{country}</span>
							)}
						</div>

						<div className="flex items-center gap-2">
							{clientId && (
								<div className="flex items-center gap-1 text-muted-foreground/80">
									<Home className="h-3 w-3" />
									<span>Client</span>
								</div>
							)}
							{supplierId && (
								<div className="flex items-center gap-1 text-muted-foreground/80">
									<Building className="h-3 w-3" />
									<span>Fournisseur</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
