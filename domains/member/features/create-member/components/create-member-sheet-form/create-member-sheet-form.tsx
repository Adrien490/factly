"use client";

import { FieldInfo, FormErrors, useAppForm } from "@/shared/components/forms";
import {
	Button,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Member } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { ReactNode, useActionState, useState } from "react";
import { toast } from "sonner";
import { createMember } from "../../actions/create-member";
import { createMemberSchema } from "../../schemas/create-member-schema";

interface CreateMemberSheetFormProps {
	children?: ReactNode;
}

export function CreateMemberSheetForm({
	children,
}: CreateMemberSheetFormProps) {
	const [isOpen, setIsOpen] = useState(false);

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createMember,
			createToastCallbacks<Member, typeof createMemberSchema>({
				loadingMessage: "Ajout du membre en cours...",
				onSuccess: (data) => {
					form.reset();
					setIsOpen(false);
					toast.success(data?.message);
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			email: "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{children || <Button className="shrink-0">Ajouter un membre</Button>}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Ajouter un membre</SheetTitle>
				</SheetHeader>

				<form
					action={dispatch}
					className="mt-6"
					onSubmit={() => form.handleSubmit()}
				>
					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					<div className="space-y-6">
						{/* Champ email */}
						<form.AppField
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "L'email est requis";
									if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
										return "L'email doit être valide";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-2">
									<field.InputField
										label="Email de l'utilisateur"
										placeholder="exemple@email.com"
										type="email"
										required
										disabled={isPending}
										autoComplete="email"
									/>
									<FieldInfo field={field} />
									<p className="text-sm text-muted-foreground">
										L&apos;utilisateur doit déjà avoir un compte avec cet email.
									</p>
								</div>
							)}
						</form.AppField>
					</div>

					{/* Bouton de soumission */}
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button
								type="submit"
								className="w-full mt-6"
								disabled={!canSubmit || isPending}
							>
								Ajouter le membre
							</Button>
						)}
					</form.Subscribe>
				</form>
			</SheetContent>
		</Sheet>
	);
}
