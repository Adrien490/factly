"use client";

import { Button, FormLabel } from "@/shared/components/ui";
import Image from "next/image";

import { COUNTRY_OPTIONS } from "@/domains/address/constants/country-options";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import {
	BUSINESS_SECTOR_OPTIONS,
	EMPLOYEE_COUNT_OPTIONS,
} from "@/domains/company/constants";
import { DotsLoader } from "@/shared/components";
import { Autocomplete } from "@/shared/components/autocomplete";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import { LEGAL_FORM_OPTIONS } from "@/shared/constants";
import { UploadDropzone, useUploadThing } from "@/shared/lib/uploadthing";
import { AddressType, Country, EmployeeCount } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { toast } from "sonner";
import { GetCompanyReturn } from "../../get-company";
import { useUpdateCompany } from "../hooks/use-update-company";

// Types pour les props
type Props = {
	company: NonNullable<GetCompanyReturn>;
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export function UpdateCompanyForm({ company, searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const [isAddressLoading, startAddressTransition] = useTransition();
	const router = useRouter();
	const { isUploading, startUpload } = useUploadThing("companyLogo");

	// Récupérer l'adresse par défaut
	const defaultAddress = company.addresses?.[0];

	const { state, dispatch, isPending } = useUpdateCompany();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: company.id,
			name: state?.inputs?.name ?? company.name ?? "",
			logoUrl: state?.inputs?.logoUrl ?? company.logoUrl ?? "",
			email: state?.inputs?.email ?? company.email ?? "",
			legalForm: state?.inputs?.legalForm ?? company.legalForm ?? "",
			siret: state?.inputs?.siret ?? company.siret ?? "",
			siren: state?.inputs?.siren ?? company.siren ?? "",
			phoneNumber: state?.inputs?.phoneNumber ?? company.phoneNumber ?? "",
			mobileNumber: state?.inputs?.mobileNumber ?? company.mobileNumber ?? "",
			faxNumber: state?.inputs?.faxNumber ?? company.faxNumber ?? "",
			website: state?.inputs?.website ?? company.website ?? "",
			nafApeCode: state?.inputs?.nafApeCode ?? company.nafApeCode ?? "",
			capital: state?.inputs?.capital ?? company.capital ?? "",
			rcs: state?.inputs?.rcs ?? company.rcs ?? "",
			vatNumber: state?.inputs?.vatNumber ?? company.vatNumber ?? "",
			businessSector:
				state?.inputs?.businessSector ?? company.businessSector ?? "",
			employeeCount:
				state?.inputs?.employeeCount ??
				company.employeeCount ??
				EmployeeCount.ONE_TO_TWO,
			isMain: company.isMain ?? false,

			// Champs d'adresse
			addressType:
				state?.inputs?.addressType ??
				defaultAddress?.addressType ??
				AddressType.HEADQUARTERS,
			addressLine1:
				state?.inputs?.addressLine1 ?? defaultAddress?.addressLine1 ?? "",
			addressLine2:
				state?.inputs?.addressLine2 ?? defaultAddress?.addressLine2 ?? "",
			postalCode: state?.inputs?.postalCode ?? defaultAddress?.postalCode ?? "",
			city: state?.inputs?.city ?? defaultAddress?.city ?? "",
			country:
				state?.inputs?.country ?? defaultAddress?.country ?? Country.FRANCE,
			latitude:
				state?.inputs?.latitude ??
				defaultAddress?.latitude ??
				(null as number | null),
			longitude:
				state?.inputs?.longitude ??
				defaultAddress?.longitude ??
				(null as number | null),
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
		if (address.coordinates && address.coordinates.length === 2) {
			// L'API retourne les coordonnées au format [longitude, latitude]
			const [longitude, latitude] = address.coordinates;
			form.setFieldValue("longitude", longitude);
			form.setFieldValue("latitude", latitude);
		} else {
			// Réinitialiser les coordonnées si elles ne sont pas disponibles
			form.setFieldValue("longitude", null);
			form.setFieldValue("latitude", null);
		}
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
			router.push(`/dashboard/company/edit?${url.toString()}`);
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
				{(field) => <input type="hidden" name="id" value={field.state.value} />}
			</form.Field>

			<form.Field name="isMain">
				{(field) => (
					<input
						type="hidden"
						name="isMain"
						value={field.state.value ? "true" : "false"}
					/>
				)}
			</form.Field>

			<form.Field name="logoUrl">
				{(field) => (
					<input type="hidden" name="logoUrl" value={field.state.value ?? ""} />
				)}
			</form.Field>

			<form.Field name="latitude">
				{(field) => (
					<input
						type="hidden"
						name="latitude"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>
			<form.Field name="longitude">
				{(field) => (
					<input
						type="hidden"
						name="longitude"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>
			<form.Field name="addressType">
				{(field) => (
					<input
						type="hidden"
						name="addressType"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section 1: Informations générales */}
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations générales de l'entreprise"
				>
					<div className="space-y-4">
						<form.AppField
							validators={{
								onChange: ({ value }) => {
									if (!value || value.trim() === "") {
										return "Le nom de l'entreprise est requis";
									}
								},
							}}
							name="name"
						>
							{(field) => (
								<field.InputField
									disabled={isPending}
									label="Nom de l'entreprise"
									placeholder="Nom de l'entreprise"
									required
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
									placeholder="Ex: contact@entreprise.com"
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
										return "Format d'URL invalide (ex: https://www.exemple.com)";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Site web"
									disabled={isPending}
									placeholder="Ex: https://www.entreprise.com"
								/>
							)}
						</form.AppField>

						{/* Logo de l'entreprise */}
						<form.Field name="logoUrl">
							{(field) => (
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<FormLabel className="text-base">
											Logo de l&apos;entreprise
										</FormLabel>
										{field.state.value && (
											<Button
												disabled={isPending}
												type="button"
												variant="ghost"
												size="sm"
												className="text-destructive"
												onClick={() => field.handleChange("")}
											>
												Supprimer
											</Button>
										)}
									</div>

									{field.state.value ? (
										<div className="flex items-center justify-center">
											<div className="relative h-24 w-24 rounded-md overflow-hidden">
												<Image
													src={field.state.value}
													alt="Logo de l'entreprise"
													fill
													sizes="96px"
													className="object-cover"
													priority
												/>
											</div>
										</div>
									) : (
										<div className="relative">
											<UploadDropzone
												endpoint="companyLogo"
												onChange={async (files) => {
													const res = await startUpload(files);
													const logoUrl = res?.[0]?.serverData?.url;
													if (logoUrl) {
														field.handleChange(logoUrl);
													}
												}}
												onUploadError={(error) => {
													console.error(error);
													toast.error("Erreur lors de l'upload", {
														description:
															"Impossible de charger le logo. Veuillez réessayer.",
													});
												}}
												className="border-2 border-dashed border-muted-foreground/25 h-32 rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-300 ut-label:text-sm ut-allowed-content:hidden hover:border-primary/30 ut-container:cursor-pointer ut-button:bg-primary ut-button:hover:bg-primary/90"
											/>

											{isUploading && (
												<div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-[2px] rounded-lg transition-all duration-300">
													<div className="flex items-center gap-3 flex-col">
														<DotsLoader color="primary" size="xs" />
													</div>
												</div>
											)}
										</div>
									)}
									<p className="text-xs text-muted-foreground mt-2">
										Formats acceptés: JPG, PNG ou SVG. Max. 2MB.
									</p>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</ContentCard>

				{/* Section 2: Informations légales */}
				<ContentCard
					title="Informations légales"
					description="Informations légales et administratives"
				>
					<div className="space-y-4">
						<form.AppField name="legalForm">
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
					</div>
				</ContentCard>

				{/* Section 3: Contact */}
				<ContentCard
					title="Informations de contact"
					description="Coordonnées de l'entreprise"
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

				{/* Section 4: Adresse */}
				<ContentCard
					title="Adresse du siège social"
					description="Adresse principale de l'entreprise"
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
												router.push(
													`/dashboard/company/edit?${url.toString()}`,
													{
														scroll: false,
													}
												);
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
											name="addressLine1"
											value={field.state.value}
											disabled={isPending}
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
											className="text-xs text-muted-foreground mt-1.5"
											id="addressLine1-info"
											role="status"
										>
											Saisissez au moins 3 caractères pour lancer la recherche
										</p>
									)}
									{field.state.value &&
										!/^[a-zA-Z0-9]/.test(field.state.value) && (
											<p
												className="text-xs text-amber-500 mt-1.5"
												id="addressLine1-warning"
												role="alert"
											>
												La recherche doit commencer par une lettre ou un chiffre
											</p>
										)}
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-destructive mt-1.5">
											{String(field.state.meta.errors[0])}
										</p>
									)}
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.AppField name="addressLine2">
							{(field) => (
								<field.InputField
									disabled={isPending}
									label="Adresse ligne 2 (optionnelle)"
									placeholder="Complément d'adresse, étage, etc."
								/>
							)}
						</form.AppField>

						<div className="grid grid-cols-2 gap-4">
							<form.AppField name="postalCode">
								{(field) => (
									<field.InputField label="Code postal" disabled={isPending} />
								)}
							</form.AppField>

							<form.AppField name="city">
								{(field) => (
									<field.InputField disabled={isPending} label="Ville" />
								)}
							</form.AppField>
						</div>
						<form.AppField name="country">
							{(field) => (
								<field.SelectField
									disabled={isPending}
									label="Pays"
									options={COUNTRY_OPTIONS}
									placeholder="Sélectionnez un pays"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{/* Section 5: Classification */}
				<ContentCard
					title="Classification"
					description="Secteur d'activité et effectif"
				>
					<div className="space-y-4">
						<form.AppField name="businessSector">
							{(field) => (
								<field.SelectField
									disabled={isPending}
									label="Secteur d'activité"
									options={BUSINESS_SECTOR_OPTIONS}
									placeholder="Sélectionnez un secteur d'activité"
								/>
							)}
						</form.AppField>

						<form.AppField name="employeeCount">
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
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending || isUploading}
						cancelHref={`/dashboard/companies`}
						submitLabel="Mettre à jour l'entreprise"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
