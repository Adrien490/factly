"use client";

import { FormLabel, Input } from "@/shared/components/ui";

import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
} from "@/shared/components/forms";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Invitation, InvitationStatus } from "@prisma/client";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { addDays } from "date-fns";
import { Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { createInvitation } from "../../actions";
import { createInvitationSchema } from "../../schemas";

interface CreateInvitationFormProps {
	organizationId?: string;
}

export function CreateInvitationForm({
	organizationId: propOrgId,
}: CreateInvitationFormProps) {
	const params = useParams();
	const router = useRouter();
	const orgId = propOrgId || (params.organizationId as string);

	const [state, dispatch] = useActionState(
		withCallbacks(
			createInvitation,
			createToastCallbacks<Invitation, typeof createInvitationSchema>({
				loadingMessage: "Envoi de l'invitation en cours...",
				onSuccess: () => {
					form.reset();
				},
				action: {
					label: "Voir les invitations",
					onClick: (data) => {
						if (data?.organizationId) {
							router.push(`/dashboard/${data.organizationId}/settings/members`);
						}
					},
				},
			})
		),
		null
	);

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			organizationId: orgId,
			email: "",
			status: InvitationStatus.PENDING,
			expiresAt: addDays(new Date(), 7),
		},
		onSubmit: async () => {
			// La soumission est gérée par l'action dispatch
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	return (
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

			<FormLayout columns={1} className="mt-6">
				{/* Section principale: information d'invitation */}
				<FormSection
					title="Inviter un nouveau membre"
					description="Envoyer une invitation par email pour rejoindre l'organisation"
					icon={Mail}
				>
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
				</FormSection>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit}
						cancelHref={`/dashboard/${orgId}/settings/members`}
						submitLabel="Envoyer l'invitation"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
