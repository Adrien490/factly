"use client";

import { AlertDialogFooter } from "@/shared/components";
import {
	AlertDialogAction,
	AlertDialogCancel,
} from "@/shared/components/shadcn-ui/alert-dialog";
import { useToast } from "@/shared/hooks";
import { ServerActionStatus } from "@/shared/types";
import { cn } from "@/shared/utils";
import { useEffect } from "react";
import { useDeleteClient } from "../hooks";
import { DeleteClientFormProps } from "./types";

export function DeleteClientForm({
	id,
	organizationId,
}: DeleteClientFormProps) {
	const { state, action, isPending } = useDeleteClient();
	const { toast, dismiss } = useToast();

	useEffect(() => {
		if (state.status === ServerActionStatus.SUCCESS) {
			toast({
				title: "Client supprimé avec succès",
				description: "Le client a été supprimé avec succès",
			});
		}
	}, [state.status, toast, dismiss]);
	return (
		<form action={action}>
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="organizationId" value={organizationId} />
			<AlertDialogFooter className="mt-6 flex items-center gap-2">
				<AlertDialogCancel className="mt-0" type="button">
					Annuler
				</AlertDialogCancel>
				<AlertDialogAction
					type="submit"
					className={cn(
						"min-w-[100px]",
						isPending && "opacity-70 cursor-not-allowed"
					)}
				>
					{isPending ? "Suppression..." : "Confirmer"}
				</AlertDialogAction>
			</AlertDialogFooter>
		</form>
	);
}
