"use client";

import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { GetClientReturn } from "@/domains/client/features/get-client";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { BUSINESS_SECTORS, EMPLOYEE_COUNTS } from "@/domains/company/constants";
import { CIVILITIES } from "@/domains/contact/constants/civilities";
import { FormLabel } from "@/shared/components";
import { LEGAL_FORMS } from "@/shared/constants";
import { generateReference } from "@/shared/utils";
import { ClientStatus, ClientType } from "@prisma/client";
import { mergeForm, useStore, useTransform } from "@tanstack/react-form";
import { Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useUpdateClient } from "../hooks/use-update-client";

type Props = {
	client: NonNullable<GetClientReturn>;
};

export function UpdateClientForm({ client }: Props) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateClient();

	const form = useAppForm({
		defaultValues: {
			organizationId,
			id: client.id,
			reference: state?.inputs?.reference ?? client.reference,
			clientType: state?.inputs?.clientType ?? client.clientType,
			status: state?.inputs?.status ?? client.status,
			notes: state?.inputs?.notes ?? client.notes,
			website: state?.inputs?.website ?? client.company?.website,
			companyName: state?.inputs?.companyName ?? client.company?.companyName,
			legalForm: state?.inputs?.legalForm ?? client.company?.legalForm,
			businessSector:
				state?.inputs?.businessSector ?? client.company?.businessSector,
			employeeCount:
				state?.inputs?.employeeCount ?? client.company?.employeeCount,
			siren: state?.inputs?.siren ?? client.company?.siren,
			siret: state?.inputs?.siret ?? client.company?.siret,
			nafApeCode: state?.inputs?.nafApeCode ?? client.company?.nafApeCode,
			capital: state?.inputs?.capital ?? client.company?.capital,
			rcs: state?.inputs?.rcs ?? client.company?.rcs,
			vatNumber: state?.inputs?.vatNumber ?? client.company?.vatNumber,
			civility: state?.inputs?.civility ?? client.contacts[0]?.civility,
			firstname: state?.inputs?.firstname ?? client.contacts[0]?.firstName,
			lastname: state?.inputs?.lastname ?? client.contacts[0]?.lastName,
			contactFunction:
				state?.inputs?.contactFunction ?? client.contacts[0]?.function,
			email: state?.inputs?.email ?? client.contacts[0]?.email,
			phoneNumber:
				state?.inputs?.phoneNumber ?? client.contacts[0]?.phoneNumber,
			mobileNumber:
				state?.inputs?.mobileNumber ?? client.contacts[0]?.mobileNumber,
			faxNumber: state?.inputs?.faxNumber ?? client.contacts[0]?.faxNumber,
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	const clientType = useStore(
		form.store,
		(state) => state.values.clientType as ClientType
	);

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

	useEffect(() => {
		form.validateField("companyName", "change");
		form.validateField("lastname", "change");
	}, [clientType, form]);

	return (
		<form
			action={dispatch}
			className="space-y-6"
			onSubmit={() => form.handleSubmit()}
		>
			<form.Subscribe selector={(state) => state.errors}>
				{(errors) => <FormErrors errors={errors} />}
			</form.Subscribe>

			<input type="hidden" name="organizationId" value={organizationId} />
			<input type="hidden" name="id" value={client.id} />

			<FormLayout withDividers columns={2} className="mt-6">
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations générales du client"
				>
					<div className="space-y-4">
						<form.AppField name="clientType">
							{(field) => (
								<div className="flex flex-col gap-3">
									<input
										type="hidden"
										name="clientType"
										value={field.state.value}
									/>
									<field.RadioGroupField
										disabled={isPending}
										label="Type de client"
										options={CLIENT_TYPES}
									/>
								</div>
							)}
						</form.AppField>

						{clientType === ClientType.COMPANY && (
							<form.AppField
								name="companyName"
								validators={{
									onChange: ({ value }) => {
										if (clientType === ClientType.COMPANY && !value) {
											return "Le nom de l'entreprise est requis pour un client entreprise";
										}
									},
								}}
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
						)}

						<form.Field
							name="reference"
							validators={{
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
					</div>
				</ContentCard>

				<ContentCard
					title={`${clientType === ClientType.COMPANY ? "Contact principal" : "Informations du contact"}`}
					description={`Informations de contact`}
				>
					<div className="space-y-4">
						<form.AppField name="civility">
							{(field) => (
								<>
									<input
										type="hidden"
										name="civility"
										value={field.state.value ?? ""}
									/>
									<field.RadioGroupField
										disabled={isPending}
										label="Civilité"
										options={CIVILITIES.map((civility) => ({
											value: civility.value,
											label: civility.label,
										}))}
									/>
								</>
							)}
						</form.AppField>

						<div className="grid grid-cols-2 gap-4">
							<form.AppField
								name="lastname"
								validators={{
									onChange: ({ value }) => {
										if (clientType === ClientType.INDIVIDUAL && !value) {
											return "Le nom est requis pour un client particulier";
										}
									},
								}}
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

							<form.AppField name="firstname">
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
							name="mobileNumber"
							validators={{
								onChange: ({ value }) => {
									if (
										value &&
										!/^(?:(?:\+|00)33|0)\s*[67](?:[\s.-]*\d{2}){4}$/.test(value)
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
					</div>
				</ContentCard>

				{/* Section 3: Informations de l'entreprise (conditionnel) */}
				{clientType === ClientType.COMPANY && (
					<ContentCard
						title="Informations légales"
						description="Informations légales de l'entreprise"
					>
						<div className="space-y-4">
							<form.AppField name="legalForm">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Forme juridique"
										options={LEGAL_FORMS}
										placeholder="Sélectionnez une forme juridique"
									/>
								)}
							</form.AppField>

							<form.AppField
								name="siret"
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
								name="siren"
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
									name="nafApeCode"
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
									name="capital"
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
								name="rcs"
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
								name="vatNumber"
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

							<form.AppField name="businessSector">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Secteur d'activité"
										options={BUSINESS_SECTORS}
										placeholder="Sélectionnez un secteur d'activité"
									/>
								)}
							</form.AppField>
							<form.AppField name="employeeCount">
								{(field) => (
									<field.SelectField
										disabled={isPending}
										label="Effectif"
										options={EMPLOYEE_COUNTS}
										placeholder="Sélectionnez l'effectif"
									/>
								)}
							</form.AppField>
						</div>
					</ContentCard>
				)}

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
									options={CLIENT_STATUSES.filter(
										(status) => status.value !== ClientStatus.ARCHIVED
									).map((status) => ({
										value: status.value,
										label: status.label,
									}))}
									placeholder="Sélectionnez un statut"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
			</FormLayout>

			<ContentCard
				title="Notes"
				description="informations complémentaires sur le client"
			>
				<div className="space-y-4">
					<form.AppField name="notes">
						{(field) => (
							<field.TextareaField
								label="Notes"
								disabled={isPending}
								rows={6}
								placeholder="Notes et informations complémentaires"
							/>
						)}
					</form.AppField>
				</div>
			</ContentCard>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						submitLabel="Modifier le client"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
