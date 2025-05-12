"use client";

import { FormLabel } from "@/shared/components";

import { COUNTRY_OPTIONS } from "@/domains/address/constants/country-options";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features";
import {
	BUSINESS_SECTOR_OPTIONS,
	EMPLOYEE_COUNT_OPTIONS,
} from "@/domains/company/constants";
import { Autocomplete } from "@/shared/components/autocomplete";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { LEGAL_FORM_OPTIONS } from "@/shared/constants";
import { useUploadThing } from "@/shared/lib/uploadthing";
import { Country } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { GetOrganizationReturn } from "../../get-organization";
import { useUpdateOrganization } from "../hooks/use-update-organization";

interface UpdateOrganizationFormProps {
	searchAddressPromise: Promise<SearchAddressReturn>;
	organization: GetOrganizationReturn;
}

export function UpdateOrganizationForm({
	searchAddressPromise,
	organization,
}: UpdateOrganizationFormProps) {
	const response = use(searchAddressPromise);
	const { state, dispatch, isPending } = useUpdateOrganization();
	const [isAddressLoading, startAddressTransition] = useTransition();
	const { isUploading, startUpload } = useUploadThing("companyLogo");
	const router = useRouter();

	console.log("[UPDATE_ORGANIZATION] State:", organization);

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: organization.id,
			companyName:
				state?.inputs?.companyName ?? organization.company?.name ?? "",
			legalForm:
				state?.inputs?.legalForm ?? organization.company?.legalForm ?? "",
			email: state?.inputs?.email ?? organization.company?.email ?? "",
			phoneNumber:
				state?.inputs?.phoneNumber ?? organization.company?.phoneNumber ?? "",
			mobileNumber:
				state?.inputs?.mobileNumber ?? organization.company?.mobileNumber ?? "",
			faxNumber:
				state?.inputs?.faxNumber ?? organization.company?.faxNumber ?? "",
			website: state?.inputs?.website ?? organization.company?.website ?? "",
			siren: state?.inputs?.siren ?? organization.company?.siren ?? "",
			siret: state?.inputs?.siret ?? organization.company?.siret ?? "",
			nafApeCode:
				state?.inputs?.nafApeCode ?? organization.company?.nafApeCode ?? "",
			capital: state?.inputs?.capital ?? organization.company?.capital ?? "",
			rcs: state?.inputs?.rcs ?? organization.company?.rcs ?? "",
			vatNumber:
				state?.inputs?.vatNumber ?? organization.company?.vatNumber ?? "",
			businessSector:
				state?.inputs?.businessSector ??
				organization.company?.businessSector ??
				"",
			employeeCount:
				state?.inputs?.employeeCount ??
				organization.company?.employeeCount ??
				"",
			logoUrl: state?.inputs?.logoUrl ?? organization.company?.logoUrl ?? "",

			// Adresse principale
			addressLine1:
				state?.inputs?.addressLine1 ?? organization.address?.addressLine1 ?? "",
			addressLine2:
				state?.inputs?.addressLine2 ?? organization.address?.addressLine2 ?? "",
			postalCode:
				state?.inputs?.postalCode ?? organization.address?.postalCode ?? "",
			city: state?.inputs?.city ?? organization.address?.city ?? "",
			country: state?.inputs?.country ?? (Country.FRANCE as Country),
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Fonction pour sélectionner une adresse dans l'autocomplétion
	const handleAddressSelect = (address: FormattedAddressResult) => {
		// Adresse ligne 1
		if (address.type === "housenumber") {
			// Si c'est une adresse complète avec numéro, on utilise le format complet
			form.setFieldValue(
				"addressLine1",
				`${address.housenumber} ${address.street}` || ""
			);
		} else if (address.type === "street") {
			// Si c'est une rue sans numéro
			form.setFieldValue("addressLine1", address.street || "");
		} else {
			// Pour les autres types (locality, municipality), on utilise simplement le label
			form.setFieldValue("addressLine1", address.label || "");
		}

		// Ville
		form.setFieldValue("city", address.city);

		// Code postal
		form.setFieldValue("postalCode", address.postcode);

		// Si on a un district (arrondissement), on l'ajoute dans addressLine2
		if (address.district) {
			form.setFieldValue("addressLine2", `Arrondissement: ${address.district}`);
		}

		// Coordonnées géographiques (longitude, latitude)
	};

	// Fonction pour effacer le champ d'adresse
	const handleClearAddressSearch = () => {
		form.setFieldValue("addressLine1", "");
		form.setFieldValue("addressLine2", "");
		form.setFieldValue("postalCode", "");
		form.setFieldValue("city", "");
		const url = new URLSearchParams();
		// Réinitialiser l'URL de recherche
		startAddressTransition(() => {
			router.push(`/dashboard/new?${url.toString()}`);
		});
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
			<form.Field name="id">
				{(field) => (
					<input type="hidden" name="id" value={field.state.value ?? ""} />
				)}
			</form.Field>

			<form.Field name="logoUrl">
				{(field) => (
					<input type="hidden" name="logoUrl" value={field.state.value ?? ""} />
				)}
			</form.Field>

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section 1: Informations de base */}
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations principales de l'organisation"
				>
					<div className="space-y-4">
						<form.AppField
							name="companyName"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom est requis";
									if (value.length < 1) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Nom de la société"
									disabled={isPending}
									placeholder="Ex: Mon entreprise"
									required
								/>
							)}
						</form.AppField>

						<form.AppField
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La forme juridique est requise";
									if (value.length < 1) return "La forme juridique est requise";
									return undefined;
								},
							}}
							name="legalForm"
						>
							{(field) => (
								<field.SelectField
									label="Forme juridique"
									disabled={isPending}
									placeholder="Sélectionnez une forme juridique"
									options={LEGAL_FORM_OPTIONS}
									required
								/>
							)}
						</form.AppField>

						<form.AppField name="email">
							{(field) => (
								<field.InputField
									label="Email"
									disabled={isPending}
									placeholder="Ex: contact@example.com"
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
					</div>
				</ContentCard>

				{/* Section 2: Identité visuelle */}
				<ContentCard
					title="Identité visuelle"
					description="Ajoutez un logo pour identifier votre organisation"
				>
					<form.AppField name="logoUrl">
						{(field) => (
							<field.UploadField
								label="Logo"
								onChange={async (files) => {
									const res = await startUpload(files);
									const url = res?.[0]?.serverData?.url;
									if (url) {
										field.handleChange(url);
									}
								}}
								disabled={isPending}
								isUploading={isUploading}
								accept="image/*"
								endpoint="companyLogo"
							/>
						)}
					</form.AppField>
				</ContentCard>

				{/* Section 3: Informations légales */}
				<ContentCard
					title="Informations légales"
					description="Renseignez les informations légales de l'organisation"
				>
					<div className="space-y-4">
						<form.AppField
							name="siren"
							validators={{
								onChange: ({ value }) => {
									if (!value || value === "") return undefined;
									if (!/^\d{9}$/.test(value)) {
										return "Le SIREN doit contenir 9 chiffres";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="SIREN"
									disabled={isPending}
									placeholder="9 chiffres (ex: 123456789)"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="siret"
							validators={{
								onChange: ({ value }) => {
									if (!value || value === "") return undefined;
									if (!/^\d{14}$/.test(value)) {
										return "Le SIRET doit contenir 14 chiffres";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="SIRET"
									disabled={isPending}
									placeholder="14 chiffres (ex: 12345678900001)"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="vatNumber"
							validators={{
								onChange: ({ value }) => {
									if (value && !/^FR\d{11}$/.test(value)) {
										return "Le numéro de TVA doit être au format FR + 11 chiffres";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Numéro de TVA"
									disabled={isPending}
									placeholder="Numéro de TVA (ex: FR1234567890)"
								/>
							)}
						</form.AppField>

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
									label="RCS"
									disabled={isPending}
									placeholder="Ex: B12345678"
								/>
							)}
						</form.AppField>

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
									label="Code APE"
									disabled={isPending}
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
									label="Capital social"
									disabled={isPending}
									placeholder="Ex: 10000.00"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{/* Section 4: Classification */}
				<ContentCard
					title="Classification"
					description="Catégorisation de l'organisation"
				>
					<div className="space-y-4">
						<form.AppField name="businessSector">
							{(field) => (
								<field.SelectField
									label="Secteur d'activité"
									disabled={isPending}
									options={BUSINESS_SECTOR_OPTIONS}
									placeholder="Sélectionnez un secteur d'activité"
								/>
							)}
						</form.AppField>

						<form.AppField name="employeeCount">
							{(field) => (
								<field.SelectField
									label="Effectif"
									disabled={isPending}
									options={EMPLOYEE_COUNT_OPTIONS}
									placeholder="Sélectionnez l'effectif"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{/* Section 5: Contact */}
				<ContentCard
					title="Contact"
					description="Informations de contact de l'organisation"
				>
					<div className="space-y-4">
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

				{/* Section 6: Adresse */}
				<ContentCard
					title="Adresse"
					description="Indiquez l'adresse de l'organisation"
				>
					<div className="space-y-4">
						<form.Field
							name="addressLine1"
							validators={{
								onChangeAsyncDebounceMs: 500,
								onChangeAsync: async ({ value }) => {
									if (
										value &&
										value.length >= 3 &&
										/^[a-zA-Z0-9]/.test(value)
									) {
										const url = new URLSearchParams();
										url.set("q", value);

										const isSubmitting = form.state.isSubmitting;

										if (!isSubmitting) {
											startAddressTransition(() => {
												router.push(`/dashboard/new?${url.toString()}`, {
													scroll: false,
												});
											});
										}
									}
								},
								onChange: ({ value }) => {
									form.setFieldValue("addressLine1", value);
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressLine1">Adresse ligne 1</FormLabel>
									<div className="relative">
										<Autocomplete
											disabled={isPending}
											name="addressLine1"
											value={field.state.value}
											onChange={(value) => {
												field.handleChange(value);
											}}
											onSelect={handleAddressSelect}
											items={response.results}
											getItemLabel={(item) => item.label}
											getItemDescription={(item) =>
												item.postcode && `${item.postcode} ${item.city}`
											}
											placeholder="Rechercher une adresse... (min. 3 caractères)"
											isLoading={isAddressLoading}
											className="w-full"
											inputClassName="border-input focus:ring-1 focus:ring-primary pr-20"
										/>
										{/* Actions dans le champ */}
										<div className="absolute right-3 top-0 h-full flex items-center gap-1">
											{/* Bouton pour effacer la recherche, visible uniquement si une valeur est présente */}
											{field.state.value && (
												<button
													type="button"
													className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
													onClick={handleClearAddressSearch}
													aria-label="Effacer la recherche d'adresse"
													title="Effacer la recherche d'adresse"
												>
													<X
														className="h-3 w-3 text-muted-foreground"
														aria-hidden="true"
													/>
												</button>
											)}
										</div>
									</div>
									{field.state.value && field.state.value.length < 3 && (
										<p
											className="text-xs text-muted-foreground"
											id="addressLine1-info"
											role="status"
										>
											Saisissez au moins 3 caractères pour lancer la recherche
										</p>
									)}
									{field.state.value &&
										!/^[a-zA-Z0-9]/.test(field.state.value) && (
											<p
												className="text-xs text-amber-500"
												id="addressLine1-warning"
												role="alert"
											>
												La recherche doit commencer par une lettre ou un chiffre
											</p>
										)}
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.AppField name="addressLine2">
							{(field) => (
								<field.InputField
									label="Adresse ligne 2"
									disabled={isPending}
									placeholder="Adresse ligne 2"
								/>
							)}
						</form.AppField>

						<div className="grid grid-cols-2 gap-4">
							<form.AppField name="postalCode">
								{(field) => (
									<field.InputField
										label="Code postal"
										disabled={isPending}
										placeholder="Code postal"
									/>
								)}
							</form.AppField>

							<form.AppField name="city">
								{(field) => (
									<field.InputField
										label="Ville"
										disabled={isPending}
										placeholder="Ville"
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField name="country">
							{(field) => (
								<field.SelectField
									label="Pays"
									disabled={isPending}
									placeholder="Sélectionnez un pays"
									options={COUNTRY_OPTIONS.map((country) => ({
										label: country.label,
										value: country.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending || isUploading}
						cancelHref="/dashboard"
						submitLabel={"Enregistrer"}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
