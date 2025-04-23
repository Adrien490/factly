"use client";

import { Button, FormLabel, Input } from "@/shared/components/ui";

import { FieldInfo, FormErrors } from "@/shared/components/forms";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/shared/components/ui/dialog";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Invitation, InvitationStatus } from "@prisma/client";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { addDays } from "date-fns";
import { useActionState, useState } from "react";
import { createInvitation } from "../actions/create-invitation";
import { createInvitationSchema } from "../schemas";

interface CreateInvitationFormProps {
	organizationId?: string;
}

export function CreateInvitationForm({
	organizationId,
}: CreateInvitationFormProps) {
	const orgId = organizationId;
	const [open, setOpen] = useState(false);

	const [state, dispatch] = useActionState(
		withCallbacks(
			createInvitation,
			createToastCallbacks<Invitation, typeof createInvitationSchema>({
				loadingMessage: "Envoi de l'invitation en cours...",
				onSuccess: () => {
					form.reset();
					setOpen(false);
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			organizationId: orgId,
			email: "",
			status: InvitationStatus.PENDING,
			expiresAt: addDays(new Date(), 7),
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">Inviter un nouveau membre</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Inviter un nouveau membre</DialogTitle>
					<DialogDescription>
						Envoyer une invitation par email pour rejoindre l&apos;organisation
					</DialogDescription>
				</DialogHeader>
				<form
					action={dispatch}
					className="space-y-6"
					onSubmit={() => form.handleSubmit()}
				>
					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Champs cachés */}
					<input type="hidden" name="organizationId" value={orgId} />
					<input
						type="hidden"
						name="expiresAt"
						value={addDays(new Date(), 7).toISOString()}
					/>
					<input type="hidden" name="status" value={InvitationStatus.PENDING} />

					<div className="space-y-4">
						<form.Field
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "L'adresse email est requise";
									if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
										return "Format d'email invalide";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="email" className="flex items-center">
										Adresse email
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="membre@exemple.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										autoComplete="email"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>

					<Button type="submit">Envoyer l&apos;invitation</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
