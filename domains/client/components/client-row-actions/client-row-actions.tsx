"use client";

import { GetClientsReturn, useDeleteClient } from "@/domains/client";
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
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/hooks/use-toast";
import { ServerActionStatus } from "@/shared/types";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ClientRowActionsProps {
	client: GetClientsReturn["clients"][number];
}

export function ClientRowActions({ client }: ClientRowActionsProps) {
	const { state, action, isPending } = useDeleteClient();
	const [isOpen, setIsOpen] = useState(false);
	const { toast, dismiss } = useToast();

	useEffect(() => {
		if (state.status === ServerActionStatus.SUCCESS) {
			dismiss();
			toast({
				title: "Client supprimé avec succès",
				description: "Le client a été supprimé avec succès",
			});
			setIsOpen(false);
		}
	}, [state.status, toast, dismiss]);

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted",
							isPending ? "opacity-50 pointer-events-none" : ""
						)}
						aria-label="Menu d'actions"
						type="button"
						disabled={isPending}
					>
						<MoreVerticalIcon className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" side="bottom" sideOffset={4}>
					<DropdownMenuItem asChild>
						<Link
							href={`/dashboard/${client.organizationId}/clients/${client.id}`}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="flex-1 truncate">Voir la fiche client</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link
							href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="flex-1 truncate">Modifier</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href={`/dashboard/${client.organizationId}/clients/${client.id}/contacts`}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="flex-1 truncate">Gestion des contacts</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href={`/dashboard/${client.organizationId}/clients/${client.id}/addresses`}
							className="flex items-center gap-2 cursor-pointer"
						>
							<span className="flex-1 truncate">Gestion des adresses</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<AlertDialogTrigger asChild>
						<DropdownMenuItem
							className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer flex items-center gap-2"
							onSelect={(e) => e.preventDefault()}
							disabled={isPending}
						>
							<span className="flex-1 truncate">Supprimer</span>
						</DropdownMenuItem>
					</AlertDialogTrigger>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-semibold">
						Êtes-vous sûr de vouloir supprimer ce client ?
					</AlertDialogTitle>
					<AlertDialogDescription className="mt-2 text-muted-foreground">
						Cette action est irréversible. Le client &quot;
						{client.name}&quot; sera définitivement supprimé de votre
						organisation.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form action={action}>
					<input type="hidden" name="id" value={client.id} />
					<input
						type="hidden"
						name="organizationId"
						value={client.organizationId}
					/>
					<AlertDialogFooter className="mt-6 flex items-center gap-2">
						<AlertDialogCancel className="mt-0" type="button">
							Annuler
						</AlertDialogCancel>
						<AlertDialogAction
							variant="destructive"
							type="submit"
							disabled={isPending}
							className={cn(
								"min-w-[100px]",
								isPending && "opacity-70 cursor-not-allowed"
							)}
						>
							{isPending ? "Suppression..." : "Confirmer"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
