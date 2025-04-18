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
	FormLabel,
	Input,
} from "@/shared/components";
import { FormErrors } from "@/shared/components/forms";

import { ServerActionStatus } from "@/shared/types";
import { cn } from "@/shared/utils";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { useDeleteClient } from "../hooks";
import { DeleteClientFormProps } from "./types";

export function DeleteClientForm({
	id,
	organizationId,
}: DeleteClientFormProps) {
	const { state, action, isPending } = useDeleteClient();

	// Configuration du formulaire avec TanStack Form
	const form = useForm({
		defaultValues: {
			id,
			organizationId,
			confirmation: "",
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	useEffect(() => {
		if (state.status === ServerActionStatus.SUCCESS) {
			toast.success("Client supprimé avec succès");
		}
	}, [state.status]);

	return (
		<form action={action} className="space-y-4">
			{/* Champs cachés */}
			<form.Field name="id">
				{(field) => (
					<input type="hidden" name="id" value={field.state.value ?? ""} />
				)}
			</form.Field>
			<form.Field name="organizationId">
				{(field) => (
					<input
						type="hidden"
						name="organizationId"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>

			{/* Erreurs globales du formulaire */}
			<form.Subscribe selector={(state) => state.errors}>
				{(errors) => <FormErrors errors={errors} />}
			</form.Subscribe>

			{/* Champ de confirmation */}
			<form.Field
				name="confirmation"
				validators={{
					onChange: ({ value }) => {
						if (!value) return "La confirmation est requise";
						if (value.toLowerCase() !== "supprimer")
							return "Veuillez saisir 'supprimer' pour confirmer";
						return undefined;
					},
				}}
			>
				{(field) => (
					<div className="space-y-2">
						<FormLabel htmlFor="confirmation" className="text-destructive">
							Pour confirmer la suppression, veuillez saisir
							&quot;supprimer&quot; ci-dessous
						</FormLabel>
						<Input
							id="confirmation"
							name="confirmation"
							placeholder="Tapez 'supprimer'"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							className={cn(
								"border-input",
								field.state.meta.errors.length > 0 &&
									"border-destructive focus:ring-destructive"
							)}
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="text-xs text-destructive mt-1">
								{String(field.state.meta.errors[0])}
							</p>
						)}
					</div>
				)}
			</form.Field>
			<AlertDialog>
				<AlertDialogTrigger asChild>
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<AlertDialogAction
								type="submit"
								className={cn(
									"min-w-[100px]",
									(isPending || !canSubmit) && "opacity-70 cursor-not-allowed"
								)}
								disabled={isPending || !canSubmit}
							>
								{isPending ? "Suppression..." : "Confirmer"}
							</AlertDialogAction>
						)}
					</form.Subscribe>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Supprimer le client</AlertDialogTitle>
						<AlertDialogDescription>
							Êtes-vous sûr de vouloir supprimer le client ?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-6 flex items-center gap-2">
						<AlertDialogCancel className="mt-0" type="button">
							Annuler
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</form>
	);
}
