"use client";

import ServerActionResponse from "@/components/server-action-response";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import deleteOrganization from "@/features/organizations/actions/delete-organization";
import { GetOrganizationReturn } from "@/features/organizations/queries/get-organization";
import deleteOrganizationFormSchema from "@/features/organizations/schemas/delete-organization-form-schema";
import { cn } from "@/lib/utils";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Organization } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import { useActionState, useState } from "react";

interface DeleteOrganizationFormProps {
	organization: GetOrganizationReturn;
}

export default function DeleteOrganizationForm({
	organization,
}: DeleteOrganizationFormProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof deleteOrganizationFormSchema>,
		FormData
	>(
		async (previous, formData) => {
			const result = await deleteOrganization(previous, formData);

			return result;
		},
		{ status: ServerActionStatus.INITIAL, message: "" }
	);

	const [form, fields] = useForm({
		id: "delete-organization-form",
		defaultValue: {
			id: organization.id,
			confirm: "",
		},
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: deleteOrganizationFormSchema.refine(
					(data) => data.confirm === organization.name,
					{
						message: "Le nom de confirmation ne correspond pas",
						path: ["confirm"],
					}
				),
			});
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	console.log(form.valid);

	return (
		<>
			<ServerActionResponse state={state} />
			<form id={form.id}>
				<input type="hidden" name="id" value={organization.id} />
				<Card className="border-destructive/50">
					<CardHeader className="border-b border-destructive/20">
						<div className="flex items-center gap-2 text-destructive">
							<AlertTriangle className="h-5 w-5" />
							<div>
								<CardTitle>Supprimer l&apos;organisation</CardTitle>
								<CardDescription className="text-destructive/80">
									Cette action est irréversible. Toutes les données de
									l&apos;organisation seront définitivement supprimées.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-4">
							<div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
								<p>Cette action va :</p>
								<ul className="mt-2 list-inside list-disc space-y-1">
									<li>Supprimer définitivement l&apos;organisation</li>
									<li>Supprimer tous les membres de l&apos;organisation</li>
									<li>Supprimer toutes les données associées</li>
									<li>Annuler toutes les invitations en cours</li>
								</ul>
							</div>

							<div className="space-y-2.5">
								<Label
									htmlFor={fields.confirm.id}
									className="text-sm font-medium text-destructive"
								>
									Pour continuer, écrivez &quot;{organization.name}&quot;
								</Label>
								<Input
									id={fields.confirm.id}
									name={fields.confirm.name}
									aria-describedby={fields.confirm.descriptionId}
									className={cn(
										"border-destructive/50",
										fields.confirm.errors && "border-destructive"
									)}
									placeholder={organization.name}
									autoComplete="off"
								/>
								{fields.confirm.errors && (
									<p
										id={fields.confirm.errorId}
										className="text-sm text-destructive"
									>
										{fields.confirm.errors[0]}
									</p>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t border-destructive/20">
						<Button
							type="button"
							variant="destructive"
							className="w-full"
							disabled={!form.valid || isPending}
							onClick={() => setIsDialogOpen(true)}
						>
							Je comprends, supprimer l&apos;organisation
						</Button>
					</CardFooter>
				</Card>
			</form>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Supprimer {organization.name} ?</AlertDialogTitle>
						<AlertDialogDescription>
							Cette action est permanente et ne peut pas être annulée. Toutes
							les données de l&apos;organisation seront définitivement
							supprimées.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Annuler</AlertDialogCancel>
						<form action={dispatch}>
							<input type="hidden" name="id" value={organization.id} />
							<input type="hidden" name="confirm" value={organization.name} />
							<Button type="submit" variant="destructive" disabled={isPending}>
								{isPending ? "Suppression..." : "Confirmer la suppression"}
							</Button>
						</form>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
