"use client";

import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
import { Button } from "@/shared/components";
import { ContentCard } from "@/shared/components/content-card";
import { FormErrors, FormLayout, useAppForm } from "@/shared/components/forms";
import { Civility } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";

import { useCreateContact } from "../hooks/use-create-contact";

interface CreateContactSheetFormProps {
	clientId?: string;
	supplierId?: string;
}

export function CreateContactSheetForm({
	clientId,
	supplierId,
}: CreateContactSheetFormProps) {
	const { state, dispatch, isPending } = useCreateContact();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			clientId: state?.inputs?.clientId ?? clientId ?? "",
			supplierId: state?.inputs?.supplierId ?? supplierId ?? "",
			firstName: state?.inputs?.firstName ?? "",
			lastName: state?.inputs?.lastName ?? "",
			civility: state?.inputs?.civility ?? ("" as Civility),
			function: state?.inputs?.function ?? "",
			email: state?.inputs?.email ?? "",
			phoneNumber: state?.inputs?.phoneNumber ?? "",
			mobileNumber: state?.inputs?.mobileNumber ?? "",
			faxNumber: state?.inputs?.faxNumber ?? "",
			website: state?.inputs?.website ?? "",
			notes: state?.inputs?.notes ?? "",
			isDefault: state?.inputs?.isDefault ?? false,
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
			<form.Field name="clientId">
				{(field) => (
					<input
						type="hidden"
						name="clientId"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>
			<form.Field name="supplierId">
				{(field) => (
					<input
						type="hidden"
						name="supplierId"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>

			<FormLayout columns={1}>
				<ContentCard
					title="Informations du contact"
					description="Renseignez les informations du contact"
				>
					<div className="space-y-4">
						<form.AppField name="civility">
							{(field) => (
								<>
									<input
										type="hidden"
										name="civility"
										value={field.state.value?.toString() ?? ""}
									/>
									<field.RadioGroupField
										disabled={isPending}
										label="Civilité"
										options={CIVILITY_OPTIONS}
									/>
								</>
							)}
						</form.AppField>

						<div className="grid grid-cols-2 gap-4">
							<form.AppField
								validators={{
									onChange: ({ value }) => {
										if (!value) return "Le prénom est requis";
									},
								}}
								name="firstName"
							>
								{(field) => (
									<field.InputField
										label="Prénom"
										disabled={isPending}
										placeholder="Prénom du contact"
										required
									/>
								)}
							</form.AppField>

							<form.AppField
								validators={{
									onChange: ({ value }) => {
										if (!value) return "Le nom est requis";
									},
								}}
								name="lastName"
							>
								{(field) => (
									<field.InputField
										label="Nom"
										disabled={isPending}
										placeholder="Nom du contact"
										required
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField name="function">
							{(field) => (
								<field.InputField
									label="Fonction"
									disabled={isPending}
									placeholder="Fonction du contact"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
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
								/>
							)}
						</form.AppField>

						<div className="grid grid-cols-2 gap-4">
							<form.AppField
								name="phoneNumber"
								validators={{
									onChange: ({ value }) => {
										if (
											value &&
											!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(
												value
											)
										) {
											return "Format de numéro de téléphone invalide (ex: +33 1 23 45 67 89)";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Téléphone"
										disabled={isPending}
										placeholder="Ex: +33 1 23 45 67 89"
									/>
								)}
							</form.AppField>

							<form.AppField
								name="mobileNumber"
								validators={{
									onChange: ({ value }) => {
										if (
											value &&
											!/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/.test(
												value
											)
										) {
											return "Format de numéro de mobile invalide (ex: +33 6 12 34 56 78)";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Mobile"
										disabled={isPending}
										placeholder="Ex: +33 6 12 34 56 78"
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField
							name="faxNumber"
							validators={{
								onChange: ({ value }) => {
									if (
										value &&
										!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(
											value
										)
									) {
										return "Format de numéro de fax invalide (ex: +33 1 23 45 67 89)";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Fax"
									disabled={isPending}
									placeholder="Ex: +33 1 23 45 67 89"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="website"
							validators={{
								onChange: ({ value }) => {
									if (
										value &&
										!/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
											value
										)
									) {
										return "Format d'URL invalide (ex: https://www.example.com)";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Site web"
									disabled={isPending}
									placeholder="Ex: https://www.example.com"
								/>
							)}
						</form.AppField>

						<form.AppField name="notes">
							{(field) => (
								<field.TextareaField
									disabled={isPending}
									label="Notes"
									rows={4}
									placeholder="Notes et informations complémentaires"
								/>
							)}
						</form.AppField>

						<form.AppField name="isDefault">
							{(field) => (
								<field.CheckboxField
									disabled={isPending}
									label="Contact par défaut"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<div className="flex justify-end gap-3">
						<Button
							type="submit"
							disabled={!canSubmit || isPending}
							className="min-w-[120px]"
						>
							{isPending ? "Création..." : "Créer le contact"}
						</Button>
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}
