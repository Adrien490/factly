"use client";

import { CLIENT_STATUS_OPTIONS } from "@/domains/client/constants";
import {
	CLIENT_TYPE_COLORS,
	CLIENT_TYPE_LABELS,
} from "@/domains/client/constants/client-type-options";
import {
	BUSINESS_SECTOR_OPTIONS,
	EMPLOYEE_COUNT_OPTIONS,
} from "@/domains/company/constants";
import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
import { Badge } from "@/shared/components";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import { Button, FormLabel, Input } from "@/shared/components/ui";
import { LEGAL_FORM_OPTIONS } from "@/shared/constants";
import { generateReference } from "@/shared/utils";
import {
	Civility,
	ClientStatus,
	ClientType,
	EmployeeCount,
} from "@prisma/client";
import { mergeForm, useStore, useTransform } from "@tanstack/react-form";
import { Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import { GetClientReturn } from "../../get-client";
import { useUpdateClient } from "../hooks/use-update-client";

type Props = {
	client: NonNullable<GetClientReturn>;
};

export function UpdateClientForm({ client }: Props) {
	const params = useParams();
	const clientId = params.clientId as string;

	const { dispatch, isPending, state } = useUpdateClient();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: clientId,
			reference: state?.inputs?.reference ?? client.reference ?? "",
			contactEmail:
				state?.inputs?.contactEmail ?? client.contacts[0]?.email ?? "",
			contactPhoneNumber:
				state?.inputs?.contactPhoneNumber ??
				client.contacts[0]?.phoneNumber ??
				"",
			contactMobileNumber:
				state?.inputs?.contactMobileNumber ??
				client.contacts[0]?.mobileNumber ??
				"",
			contactFaxNumber:
				state?.inputs?.contactFaxNumber ?? client.contacts[0]?.faxNumber ?? "",
			contactCivility:
				state?.inputs?.contactCivility ?? client.contacts[0]?.civility ?? "",
			contactFirstName:
				state?.inputs?.contactFirstName ?? client.contacts[0]?.firstName ?? "",
			contactLastName:
				state?.inputs?.contactLastName ?? client.contacts[0]?.lastName ?? "",
			contactFunction:
				state?.inputs?.contactFunction ?? client.contacts[0]?.function ?? "",
			contactWebsite:
				state?.inputs?.contactWebsite ?? client.contacts[0]?.website ?? "",
			companyLegalForm:
				state?.inputs?.companyLegalForm ?? client.company?.legalForm ?? "",
			type: state?.inputs?.type ?? client.type,
			status: state?.inputs?.status ?? client.status,
			contactNotes:
				state?.inputs?.contactNotes ?? client.contacts[0]?.notes ?? "",
			companySiren: state?.inputs?.companySiren ?? client.company?.siren ?? "",
			companySiret: state?.inputs?.companySiret ?? client.company?.siret ?? "",
			companyNafApeCode:
				state?.inputs?.companyNafApeCode ?? client.company?.nafApeCode ?? "",
			companyVatNumber:
				state?.inputs?.companyVatNumber ?? client.company?.vatNumber ?? "",
			companyBusinessSector:
				state?.inputs?.companyBusinessSector ??
				client.company?.businessSector ??
				"",
			companyCapital:
				state?.inputs?.companyCapital ?? client.company?.capital ?? "",
			companyRcs: state?.inputs?.companyRcs ?? client.company?.rcs ?? "",
			companyEmployeeCount:
				state?.inputs?.companyEmployeeCount ??
				client.company?.employeeCount ??
				EmployeeCount.ONE_TO_TWO,
			companyName: state?.inputs?.companyName ?? client.company?.name ?? "",
			companyEmail: state?.inputs?.companyEmail ?? client.company?.email ?? "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Fonction simplifiée pour générer une référence automatique (sans vérification)
	const handleGenerateReference = async () => {
		try {
			const reference = await generateReference({
				prefix: "CLI",
				format: "alphanumeric",
				length: 2,
				separator: "-",
			});

			form.setFieldValue("reference", reference);
			form.validateField("reference", "change");
		} catch (error) {
			console.error("Erreur lors de la génération de référence", error);
		}
	};

	const clientType = useStore(
		form.store,
		(state) => state.values.type as ClientType
	);

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
			<form.Field name="id">
				{(field) => <input type="hidden" name="id" value={field.state.value} />}
			</form.Field>
			{/* Champs cachés */}

			<FormLayout withDividers columns={2}>
				{/* Section 1: Informations de base */}
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations générales du client"
				>
					<div className="space-y-4">
						<form.AppField name="type">
							{(field) => (
								<div className="flex flex-col gap-3">
									<input type="hidden" name="type" value={field.state.value} />
									<div className="space-y-1.5">
										<FormLabel>Type de client</FormLabel>
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${CLIENT_TYPE_COLORS[clientType]}20`,
												color: CLIENT_TYPE_COLORS[clientType],
												borderColor: `${CLIENT_TYPE_COLORS[clientType]}40`,
											}}
										>
											{CLIENT_TYPE_LABELS[clientType]}
										</Badge>
									</div>
								</div>
							)}
						</form.AppField>
						{clientType === ClientType.COMPANY && (
							<>
								<form.AppField
									validators={{
										onChange: ({ value }) => {
											if (clientType === ClientType.COMPANY && !value) {
												return "Le nom de la société est requis pour un client entreprise";
											}
										},
									}}
									name="companyName"
								>
									{(field) => (
										<field.InputField
											disabled={isPending}
											label="Nom de la société"
											placeholder="Nom de l'entreprise"
											required
										/>
									)}
								</form.AppField>
								<form.AppField
									name="companyEmail"
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
											label="Email de la société"
											disabled={isPending}
											placeholder="Ex: contact@example.com"
										/>
									)}
								</form.AppField>
							</>
						)}

						<form.Field
							validators={{
								onChange: ({ value }) => {
									if (value && value.length < 3)
										return "La référence doit comporter au moins 3 caractères";
								},
							}}
							name="reference"
						>
							{(field) => (
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<FormLabel htmlFor="reference">Référence</FormLabel>
										<Button
											type="button"
											variant="ghost"
											disabled={isPending}
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
											id="reference"
											disabled={isPending}
											name="reference"
											placeholder="Référence unique (ex: CLI-001)"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>

									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.AppField
							name="contactWebsite"
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
						<form.AppField name="contactNotes">
							{(field) => (
								<field.TextareaField
									disabled={isPending}
									label="Notes"
									rows={6}
									placeholder="Notes et informations complémentaires"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
				<ContentCard
					title={`${clientType === ClientType.COMPANY ? "Contact principal" : "Informations du contact"}`}
					description={`Informations de contact`}
				>
					<div className="space-y-4">
						<form.AppField name="contactCivility">
							{(field) => (
								<>
									<input
										type="hidden"
										name="contactCivility"
										value={field.state.value as Civility}
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
										if (clientType === ClientType.INDIVIDUAL && !value) {
											return "Le nom est obligatoire pour un client particulier";
										}
									},
								}}
								name="contactLastName"
							>
								{(field) => (
									<field.InputField
										label="Nom"
										disabled={isPending}
										placeholder="Nom du contact"
										required={clientType === ClientType.INDIVIDUAL}
									/>
								)}
							</form.AppField>

							<form.AppField name="contactFirstName">
								{(field) => (
									<field.InputField
										label="Prénom"
										disabled={isPending}
										placeholder="Prénom du contact"
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField name="contactFunction">
							{(field) => (
								<field.InputField
									label="Fonction"
									disabled={isPending}
									placeholder="Fonction du contact"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="contactEmail"
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
								name="contactPhoneNumber"
								validators={{
									onChange: ({ value }) => {
										if (
											value &&
											!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(
												value
											)
										) {
											return "Format de numéro de téléphone invalide (ex: +33 6 23 45 67 89)";
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
								name="contactMobileNumber"
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
							name="contactFaxNumber"
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

						<form.AppField name="contactNotes">
							{(field) => (
								<field.TextareaField
									label="Notes"
									disabled={isPending}
									placeholder="Notes de contact"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{clientType === ClientType.COMPANY && (
					<ContentCard
						title="Informations légales"
						description="Informations légales de l'entreprise"
					>
						<div className="space-y-4">
							<form.AppField name="companyLegalForm">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Forme juridique"
										options={LEGAL_FORM_OPTIONS}
										placeholder="Sélectionnez une forme juridique"
									/>
								)}
							</form.AppField>

							<form.AppField
								name="companySiret"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\d{14}$/.test(value)) {
											return "Le numéro SIRET doit comporter exactement 14 chiffres";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										disabled={isPending}
										label="SIRET"
										placeholder="14 chiffres (ex: 12345678900001)"
									/>
								)}
							</form.AppField>
							<form.AppField
								name="companySiren"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\d{9}$/.test(value)) {
											return "Le numéro SIREN doit comporter exactement 9 chiffres";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										disabled={isPending}
										label="SIREN"
										placeholder="9 chiffres (ex: 123456789)"
									/>
								)}
							</form.AppField>

							<div className="grid grid-cols-2 gap-4">
								<form.AppField
									name="companyNafApeCode"
									validators={{
										onChange: ({ value }) => {
											if (value && !/^[0-9]{4}[A-Z]$/.test(value)) {
												return "Le code APE doit être au format 4 chiffres + 1 lettre (ex: 6201Z)";
											}
											return undefined;
										},
									}}
								>
									{(field) => (
										<field.InputField
											disabled={isPending}
											label="Code APE"
											placeholder="Ex: 6201Z"
										/>
									)}
								</form.AppField>

								<form.AppField
									name="companyCapital"
									validators={{
										onChange: ({ value }) => {
											if (value && !/^\d+(?:[.,]\d{1,2})?$/.test(value)) {
												return "Le capital doit être un nombre avec maximum 2 décimales";
											}
											return undefined;
										},
									}}
								>
									{(field) => (
										<field.InputField
											disabled={isPending}
											label="Capital social"
											placeholder="Ex: 10000.00"
										/>
									)}
								</form.AppField>
							</div>
							<form.AppField
								name="companyRcs"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^[A-Z]\d{8}$/.test(value)) {
											return "Le numéro RCS doit commencer par une lettre suivie de 8 chiffres (ex: B12345678)";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										disabled={isPending}
										label="RCS"
										placeholder="Ex: B12345678"
									/>
								)}
							</form.AppField>
							<form.AppField
								name="companyVatNumber"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^FR\d{2}\d{9}$/.test(value)) {
											return "Le numéro de TVA doit être au format FR + 2 chiffres + 9 chiffres (ex: FR12345678900)";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										disabled={isPending}
										label="N° TVA"
										placeholder="Ex: FR12345678900"
									/>
								)}
							</form.AppField>

							<form.AppField name="companyBusinessSector">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Secteur d'activité"
										options={BUSINESS_SECTOR_OPTIONS}
										placeholder="Sélectionnez un secteur d'activité"
									/>
								)}
							</form.AppField>
							<form.AppField name="companyEmployeeCount">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Effectif"
										options={EMPLOYEE_COUNT_OPTIONS}
										placeholder="Sélectionnez l'effectif"
									/>
								)}
							</form.AppField>
						</div>
					</ContentCard>
				)}

				{/* Section 3: Classification */}

				<ContentCard
					title="Classification"
					description="Catégorisation et statut du client"
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
									options={CLIENT_STATUS_OPTIONS.filter(
										(status) => status.value !== ClientStatus.ARCHIVED
									)}
									placeholder="Sélectionnez un statut"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						cancelHref={`/dashboard/commercial/clients`}
						submitLabel="Enregistrer"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
