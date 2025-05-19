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
} from "@/shared/components";
import { FormErrors, useAppForm } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Organization } from "@prisma/client";
import { useTransform } from "@tanstack/react-form";
import { useActionState, useState } from "react";
import { softDeleteOrganization } from "../actions/soft-delete-organization";
import { softDeleteOrganizationSchema } from "../schemas/soft-delete-organization-schema";

interface SoftDeleteOrganizationAlertDialogProps {
	id: string;
	children?: React.ReactNode;
}

export function SoftDeleteOrganizationAlertDialog({
	id,
	children,
}: SoftDeleteOrganizationAlertDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			softDeleteOrganization,
			createToastCallbacks<Organization, typeof softDeleteOrganizationSchema>({
				loadingMessage: "Suppression de l'organisation en cours...",
				onSuccess: () => {
					setIsOpen(false);
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id,
			confirmation: "",
		},
		transform: useTransform((baseForm) => baseForm, [state]),
	});

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<form
					action={dispatch}
					className="space-y-4"
					onSubmit={() => form.handleSubmit()}
				>
					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Champs cachés */}
					<form.Field name="id">
						{(field) => (
							<input type="hidden" name="id" value={field.state.value} />
						)}
					</form.Field>

					<AlertDialogHeader>
						<AlertDialogTitle className="text-destructive">
							Attention
						</AlertDialogTitle>
						<AlertDialogDescription>
							Vous êtes sur le point de supprimer définitivement cette
							organisation.
							<br />
							Cette action est irréversible et affectera toutes les données
							associées.
							<br />
							Pour confirmer, veuillez écrire SUPPRIMER ci-dessous.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<form.Field
						name="confirmation"
						validators={{
							onChange: ({ value }) => {
								if (value !== "SUPPRIMER") {
									return "Veuillez écrire SUPPRIMER pour confirmer";
								}
							},
						}}
					>
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor="confirmation">Confirmation</Label>
								<Input
									id="confirmation"
									name="confirmation"
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Écrivez SUPPRIMER pour confirmer"
									disabled={isPending}
									className="font-mono"
								/>
								{field.state.meta.errors.length > 0 && (
									<p className="text-xs text-destructive mt-1.5">
										{String(field.state.meta.errors[0])}
									</p>
								)}
							</div>
						)}
					</form.Field>

					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<form.Subscribe selector={(state) => [state.canSubmit]}>
							{([canSubmit]) => (
								<AlertDialogAction
									type="submit"
									disabled={!canSubmit || isPending}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Supprimer l&apos;organisation
								</AlertDialogAction>
							)}
						</form.Subscribe>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
