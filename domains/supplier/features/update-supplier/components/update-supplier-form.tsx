"use client";

import {
	BUSINESS_SECTOR_OPTIONS,
	EMPLOYEE_COUNT_OPTIONS,
} from "@/domains/company/constants";
import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
import { SUPPLIER_STATUS_OPTIONS } from "@/domains/supplier/constants/supplier-status-options";
import { SUPPLIER_TYPE_OPTIONS } from "@/domains/supplier/constants/supplier-type-options";
import { GetSupplierReturn } from "@/domains/supplier/features/get-supplier";
import { ContentCard } from "@/shared/components/content-card";
import { FormErrors, FormLayout, useAppForm } from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import { FormLabel } from "@/shared/components/ui";
import { LEGAL_FORM_OPTIONS } from "@/shared/constants";
import { SupplierType } from "@prisma/client";
import { mergeForm, useStore, useTransform } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import { useUpdateSupplier } from "../hooks/use-update-supplier";

type Props = {
	supplier: NonNullable<GetSupplierReturn>;
};

export function UpdateSupplierForm({ supplier }: Props) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateSupplier();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: state?.inputs?.id ?? supplier.id,
			organizationId: state?.inputs?.organizationId ?? supplier.organizationId,
			reference: state?.inputs?.reference ?? supplier.reference ?? "",
			type: state?.inputs?.type ?? supplier.type,
			status: state?.inputs?.status ?? supplier.status,

			// Champs du contact
			contactCivility:
				state?.inputs?.contactCivility ?? supplier.contacts[0]?.civility ?? "",
			contactFirstName:
				state?.inputs?.contactFirstName ??
				supplier.contacts[0]?.firstName ??
				"",
			contactLastName:
				state?.inputs?.contactLastName ?? supplier.contacts[0]?.lastName ?? "",
			contactFunction:
				state?.inputs?.contactFunction ?? supplier.contacts[0]?.function ?? "",
			contactEmail:
				state?.inputs?.contactEmail ?? supplier.contacts[0]?.email ?? "",
			contactPhoneNumber:
				state?.inputs?.contactPhoneNumber ??
				supplier.contacts[0]?.phoneNumber ??
				"",
			contactMobileNumber:
				state?.inputs?.contactMobileNumber ??
				supplier.contacts[0]?.mobileNumber ??
				"",
			contactFaxNumber:
				state?.inputs?.contactFaxNumber ??
				supplier.contacts[0]?.faxNumber ??
				"",
			contactWebsite:
				state?.inputs?.contactWebsite ?? supplier.contacts[0]?.website ?? "",
			contactNotes:
				state?.inputs?.contactNotes ?? supplier.contacts[0]?.notes ?? "",

			// Champs de l'entreprise
			companyName: state?.inputs?.companyName ?? supplier.company?.name ?? "",
			companyLegalForm:
				state?.inputs?.companyLegalForm ?? supplier.company?.legalForm ?? "",
			companyEmail:
				state?.inputs?.companyEmail ?? supplier.company?.email ?? "",
			companySiren:
				state?.inputs?.companySiren ?? supplier.company?.siren ?? "",
			companySiret:
				state?.inputs?.companySiret ?? supplier.company?.siret ?? "",
			companyNafApeCode:
				state?.inputs?.companyNafApeCode ?? supplier.company?.nafApeCode ?? "",
			companyCapital:
				state?.inputs?.companyCapital ?? supplier.company?.capital ?? "",
			companyRcs: state?.inputs?.companyRcs ?? supplier.company?.rcs ?? "",
			companyVatNumber:
				state?.inputs?.companyVatNumber ?? supplier.company?.vatNumber ?? "",
			companyBusinessSector:
				state?.inputs?.companyBusinessSector ??
				supplier.company?.businessSector ??
				"",
			companyEmployeeCount:
				state?.inputs?.companyEmployeeCount ??
				supplier.company?.employeeCount ??
				"",
		},
		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	const supplierType = useStore(
		form.store,
		(state) => state.values.type as SupplierType
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

			{/* Champs cachés */}
			<form.Field name="organizationId">
				{(field) => (
					<input
						type="hidden"
						name="organizationId"
						value={field.state.value}
					/>
				)}
			</form.Field>
			<form.Field name="id">
				{(field) => <input type="hidden" name="id" value={field.state.value} />}
			</form.Field>

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section 1: Informations de base */}
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations principales du fournisseur"
				>
					<div className="space-y-4">
						<form.AppField name="type">
							{(field) => (
								<div className="flex flex-col gap-3">
									<input type="hidden" name="type" value={field.state.value} />
									<field.RadioGroupField
										disabled={isPending}
										label="Type de fournisseur"
										options={SUPPLIER_TYPE_OPTIONS}
										onValueChangeCallback={(value) => {
											if (value === SupplierType.INDIVIDUAL) {
												form.resetField("companyName");
											} else if (
												value === SupplierType.COMPANY &&
												form.getFieldValue("companyName") === ""
											) {
												form.resetField("contactLastName");
											}
										}}
									/>
								</div>
							)}
						</form.AppField>

						{supplierType === SupplierType.COMPANY && (
							<>
								<form.AppField
									validators={{
										onChange: ({ value }) => {
											if (supplierType === SupplierType.COMPANY && !value) {
												return "Le nom de la société est requis pour un fournisseur entreprise";
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

						<form.AppField
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
									<FormLabel htmlFor="reference">Référence</FormLabel>
									<field.InputField
										disabled={isPending}
										placeholder="Référence unique (ex: FOU-001)"
									/>
								</div>
							)}
						</form.AppField>

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

				{/* Section 2: Informations du contact */}
				<ContentCard
					title={`${supplierType === SupplierType.COMPANY ? "Contact principal" : "Informations du contact"}`}
					description={`Informations de contact`}
				>
					<div className="space-y-4">
						<form.AppField name="contactCivility">
							{(field) => (
								<>
									<input
										type="hidden"
										name="contactCivility"
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
										if (supplierType === SupplierType.INDIVIDUAL && !value) {
											return "Le nom est obligatoire pour un fournisseur particulier";
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
										required={supplierType === SupplierType.INDIVIDUAL}
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
					</div>
				</ContentCard>

				{supplierType === SupplierType.COMPANY && (
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
					description="Catégorisation et statut du fournisseur"
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
									options={SUPPLIER_STATUS_OPTIONS.filter(
										(status) => status.value !== "ARCHIVED"
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
						cancelHref={`/dashboard/${organizationId}/suppliers`}
						submitLabel="Mettre à jour le fournisseur"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
