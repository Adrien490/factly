"use client";

import { Button } from "@/shared/components";
import { FormErrors, useAppForm } from "@/shared/components/forms";
import { useSignUpEmail } from "../hooks/use-sign-up-email";

export function SignUpEmailForm() {
	const { dispatch, isPending } = useSignUpEmail();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			name: "",
		},
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

			<div className="space-y-4">
				<form.AppField
					name="name"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "Le nom est requis";
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.InputField
							label="Nom"
							disabled={isPending}
							placeholder="Votre nom"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="email"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "L'email est requis";
							if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
								return "Format d'email invalide";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.InputField
							label="Email"
							disabled={isPending}
							placeholder="Ex: contact@example.com"
							type="email"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="password"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "Le mot de passe est requis";
							if (value.length < 8) {
								return "Le mot de passe doit contenir au moins 8 caractères";
							}
							if (value.length > 32) {
								return "Le mot de passe ne doit pas dépasser 32 caractères";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.InputField
							label="Mot de passe"
							disabled={isPending}
							placeholder="Votre mot de passe"
							type="password"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="confirmPassword"
					validators={{
						onChange: ({ value }) => {
							if (!value) return "La confirmation du mot de passe est requise";
							if (value.length < 8) {
								return "Le mot de passe doit contenir au moins 8 caractères";
							}
							if (value.length > 32) {
								return "Le mot de passe ne doit pas dépasser 32 caractères";
							}
							return undefined;
						},
					}}
				>
					{(field) => (
						<field.InputField
							label="Confirmer le mot de passe"
							disabled={isPending}
							placeholder="Confirmez votre mot de passe"
							type="password"
							required
						/>
					)}
				</form.AppField>
			</div>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<Button
						disabled={!canSubmit || isPending}
						className="w-full"
						type="submit"
					>
						S&apos;inscrire
					</Button>
				)}
			</form.Subscribe>
		</form>
	);
}
