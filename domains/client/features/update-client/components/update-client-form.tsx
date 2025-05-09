"use client";

import { Button } from "@/shared/components";
import {
	FieldInfo,
	FormCard,
	FormErrors,
	FormFooter,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { GetClientReturn } from "@/domains/client/features/get-client";
import { generateReference } from "@/shared/utils/generate-reference";
import { ClientType } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { Building, Clock, Receipt, Tag, User, Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useUpdateClient } from "../hooks/use-update-client";

type Props = {
	client: NonNullable<GetClientReturn>;
};

export function UpdateClientForm({ client }: Props) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateClient();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: state?.inputs?.id ?? client.id,
			organizationId,
			name: state?.inputs?.name ?? client.name,
			reference: state?.inputs?.reference ?? client.reference,
			email: state?.inputs?.email ?? client.email,
			phone: state?.inputs?.phone ?? client.phone,
			website: state?.inputs?.website ?? client.website,
			clientType: state?.inputs?.clientType ?? client.clientType,
			status: state?.inputs?.status ?? client.status,
			notes: state?.inputs?.notes ?? client.notes,
			siren: state?.inputs?.siren ?? client.siren,
			siret: state?.inputs?.siret ?? client.siret,
			vatNumber: state?.inputs?.vatNumber ?? client.vatNumber,
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Fonction pour générer une référence automatique
	const handleGenerateReference = async () => {
		try {
			const reference = await generateReference({
				prefix: "CLI",
				format: "alphanumeric",
				length: 2,
				separator: "-",
			});

			form.setFieldValue("reference", reference);
			const formData = new FormData();
			formData.set("reference", reference);
			formData.set("organizationId", organizationId);
		} catch {
			// Silencieusement gérer l'erreur sans afficher de toast
			console.error("Erreur lors de la génération de référence");
		}
	};

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
			<form.Field name="organizationId">
				{(field) => (
					<input
						type="hidden"
						name="organizationId"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>
			<form.Field name="id">
				{(field) => (
					<input type="hidden" name="id" value={field.state.value ?? ""} />
				)}
			</form.Field>

			<FormLayout withDividers columns={2} className="">
				{/* Section 1: Informations de base */}
				<FormCard
					title="Informations de base"
					description="Renseignez les informations principales du client"
					icon={Building}
				>
					<div className="space-y-4">
						<form.Field
							name="reference"
							validators={{
								onChangeAsyncDebounceMs: 500,
								onChange: ({ value }) => {
									if (!value) return "La référence est requise";
									if (value.length < 3)
										return "La référence doit comporter au moins 3 caractères";
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<FormLabel htmlFor="reference">
											Référence
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Button
											disabled={isPending}
											type="button"
											variant="ghost"
											size="sm"
											onClick={handleGenerateReference}
											title="Générer une référence unique"
											className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
										>
											<Wand2 className="h-3 w-3 mr-1" />
											Générer
										</Button>
									</div>

									<div className="relative">
										<Input
											disabled={isPending}
											id="reference"
											name="reference"
											placeholder="Référence unique (ex: CLI-001)"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{/* Indicateurs de statut discrets */}
									</div>

									{/* Message de statut et d'aide */}

									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.AppField
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom du client est requis";
									if (value.length < 1) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Nom"
									disabled={isPending}
									placeholder="Nom du client ou de l'entreprise"
								/>
							)}
						</form.AppField>

						<form.AppField name="clientType">
							{(field) => (
								<field.SelectField
									label="Type de client"
									disabled={isPending}
									placeholder="Sélectionnez un type"
									options={CLIENT_TYPES.map((type) => ({
										label: type.label,
										value: type.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</FormCard>

				{/* Section 4: Informations fiscales */}
				<FormCard
					title="Informations fiscales"
					description="Identifiants fiscaux et réglementaires"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.Subscribe selector={(state) => state.values.clientType}>
							{(clientType) => (
								<>
									{clientType === ClientType.COMPANY ? (
										<>
											<form.AppField name="siren">
												{(field) => (
													<field.InputField
														label="SIREN"
														disabled={isPending}
														placeholder="9 chiffres (ex: 123456789)"
													/>
												)}
											</form.AppField>

											<form.AppField name="siret">
												{(field) => (
													<field.InputField
														label="SIRET"
														disabled={isPending}
														placeholder="14 chiffres (ex: 12345678900001)"
													/>
												)}
											</form.AppField>
										</>
									) : (
										<>
											<form.Field name="siret">
												{(field) => (
													<input
														type="hidden"
														name="siret"
														value={field.state.value ?? ""}
													/>
												)}
											</form.Field>
											<form.Field name="siren">
												{(field) => (
													<input
														type="hidden"
														name="siren"
														value={field.state.value ?? ""}
													/>
												)}
											</form.Field>
										</>
									)}
								</>
							)}
						</form.Subscribe>

						<form.AppField name="vatNumber">
							{(field) => (
								<field.InputField
									label="Numéro de TVA"
									disabled={isPending}
									placeholder="Numéro de TVA (ex: FR1234567890)"
								/>
							)}
						</form.AppField>
					</div>
				</FormCard>

				{/* Section 3: Classification */}
				<FormCard
					title="Classification"
					description="Catégorisation et statut du client"
					icon={Tag}
				>
					<div className="space-y-4">
						<form.AppField
							name="status"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le statut est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Statut"
									disabled={isPending}
									placeholder="Sélectionnez un statut"
									options={CLIENT_STATUSES.map((status) => ({
										label: status.label,
										value: status.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</FormCard>

				{/* Section 2: Informations de contact */}
				<FormCard
					title="Informations de contact"
					description="Coordonnées du client"
					icon={User}
				>
					<div className="space-y-4">
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
									placeholder="contact@example.com"
								/>
							)}
						</form.AppField>

						<form.AppField name="phone">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="phone" className="flex items-center">
										Téléphone
									</FormLabel>
									<Input
										disabled={isPending}
										id="phone"
										name="phone"
										placeholder="Ex: +33 1 23 45 67 89"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
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
										return "L'URL n'est pas valide";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Site web"
									disabled={isPending}
									placeholder="https://www.example.com"
								/>
							)}
						</form.AppField>
					</div>
				</FormCard>

				<FormCard
					title="Suivi commercial"
					description="Informations de suivi et qualification"
					icon={Clock}
				>
					<div className="space-y-4">
						<form.AppField name="notes">
							{(field) => (
								<field.TextareaField
									label="Notes"
									disabled={isPending}
									placeholder="Notes et informations complémentaires"
								/>
							)}
						</form.AppField>
					</div>
				</FormCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						submitLabel="Modifier le client"
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
