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
	DropdownMenuItem,
} from "@/shared/components";
import { MiniDotsLoader } from "@/shared/components/loaders";
import { cn } from "@/shared/utils";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import { useDeleteClient } from "../hooks";
import { DeleteClientFormProps } from "./types";

export function DeleteClientAlertDialogForm({ client }: DeleteClientFormProps) {
	const { dispatch, isPending } = useDeleteClient();
	const [isActionPending, startTransition] = useTransition();

	// Gestion de la soumission du formulaire
	const handleDelete = () => {
		startTransition(() => {
			const formData = new FormData();
			formData.append("id", client.id);
			formData.append("organizationId", client.organizationId);
			formData.append("confirmation", "supprimer");
			dispatch(formData);
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<DropdownMenuItem
					onSelect={(e) => e.preventDefault()}
					className="text-destructive focus:text-destructive"
				>
					<Trash className="h-4 w-4 mr-2" />
					<span>Supprimer</span>
				</DropdownMenuItem>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className="text-destructive">
						Êtes-vous sûr de vouloir supprimer ce client ?
					</AlertDialogTitle>
					<AlertDialogDescription className="mt-2">
						Cette action est irréversible. Cela supprimera définitivement le
						client
						{client.name && <strong> {client.name}</strong>} et toutes ses
						données associées.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="hover:text-gray-800 hover:border-violet-500">
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className={cn(
							"bg-destructive hover:bg-destructive/90",
							isPending && "opacity-70 cursor-not-allowed"
						)}
						disabled={isPending || isActionPending}
					>
						{isPending || isActionPending ? (
							<div className="flex items-center gap-1">
								<span>Suppression</span>
								<MiniDotsLoader />
							</div>
						) : (
							"Supprimer"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
