"use client";

import {
	deleteOrganization,
	deleteOrganizationSchema,
} from "@/domains/organization/features/delete-organization";
import { GetOrganizationReturn } from "@/domains/organization/features/get-organization/types";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from "@/shared/components";
import {
	ServerActionState,
	ServerActionStatus,
} from "@/shared/types/server-action";
import { cn } from "@/shared/utils";
import { Organization } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import { useActionState, useState } from "react";

interface DeleteOrganizationFormProps {
	organization: GetOrganizationReturn;
}

export function DeleteOrganizationForm({
	organization,
}: DeleteOrganizationFormProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof deleteOrganizationSchema>,
		FormData
	>(
		async (previous, formData) => {
			const result = await deleteOrganization(previous, formData);

			return result;
		},
		{ status: ServerActionStatus.INITIAL, message: "" }
	);

	console.log(state);

	return (
		<>
			<form>
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
									htmlFor="confirm"
									className="text-sm font-medium text-destructive"
								>
									Pour continuer, écrivez &quot;{organization.name}&quot;
								</Label>
								<Input
									id="confirm"
									name="confirm"
									aria-describedby="confirm-description"
									className={cn("border-destructive/50")}
									placeholder={organization.name}
									autoComplete="off"
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter className="border-t border-destructive/20">
						<Button
							type="button"
							variant="destructive"
							className="w-full"
							disabled={isPending}
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
