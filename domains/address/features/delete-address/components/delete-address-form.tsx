"use client";

import { AlertDialogFooter } from "@/shared/components";
import {
	AlertDialogAction,
	AlertDialogCancel,
} from "@/shared/components/ui/alert-dialog";
import { ActionStatus } from "@/shared/types";
import { cn } from "@/shared/utils";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDeleteAddress } from "../hooks/use-delete-address";
import { DeleteAddressFormProps } from "./types";

export function DeleteAddressForm({
	id,
	organizationId,
}: DeleteAddressFormProps) {
	const { state, action, isPending } = useDeleteAddress();

	useEffect(() => {
		if (state.status === ActionStatus.SUCCESS) {
			toast.success("Adresse supprimée avec succès");
		}
	}, [state.status]);

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
