"use client";

import { Button, FormLabel } from "@/shared/components";

import { COUNTRIES } from "@/domains/address/constants";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features";
import { useCreateOrganization } from "@/domains/organization/features";
import { Autocomplete } from "@/shared/components/autocomplete";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
	useAppForm,
} from "@/shared/components/forms";
import { GridLoader } from "@/shared/components/loaders";
import { MiniDotsLoader } from "@/shared/components/loaders/mini-dots-loader";
import { LEGAL_FORM_OPTIONS } from "@/shared/constants/legal-form-options";
import { UploadDropzone, useUploadThing } from "@/shared/lib/uploadthing";
import { LegalForm } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { Building2, Globe, MapPin, Receipt, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { toast } from "sonner";

interface OrganizationFormProps {
	searchAddressPromise: Promise<SearchAddressReturn>;
}

export function CreateOrganizationForm({
	searchAddressPromise,
}: OrganizationFormProps) {
	const response = use(searchAddressPromise);
	const { state, dispatch, isPending } = useCreateOrganization();
	const [isAddressLoading, startAddressTransition] = useTransition();
	const { isUploading, startUpload } = useUploadThing("organizationLogo");
	const router = useRouter();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: state?.data?.id ?? "",
			name: state?.data?.name ?? "",
			legalName: state?.data?.legalName ?? "",
			legalForm: state?.data?.legalForm ?? (undefined as LegalForm | undefined),
			email: state?.data?.email ?? "",
			siren: state?.data?.siren ?? "",
			siret: state?.data?.siret ?? "",
			vatNumber: state?.data?.vatNumber ?? "",
			addressLine1: state?.data?.addressLine1 ?? "",
			addressLine2: state?.data?.addressLine2 ?? "",
			postalCode: state?.data?.postalCode ?? "",
			city: state?.data?.city ?? "",
			country: state?.data?.country ?? "",
			phone: state?.data?.phone ?? "",
			website: state?.data?.website ?? "",
			logoUrl: state?.data?.logoUrl ?? "",
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

			<form.AppField name="country">
				{(field) => (
					<field.SelectField
						label="Pays"
						disabled={isPending}
						placeholder="Sélectionnez un pays"
						options={COUNTRIES.map((country) => ({
							label: country.label,
							value: country.value,
						}))}
					/>
				)}
			</form.AppField>

			<FormLayout columns={2} className="mt-6">
				{/* Section Logo */}
				<FormSection
					title="Identité visuelle"
					description="Ajoutez un logo pour identifier votre organisation"
					icon={Upload}
				>
					<form.Field name="logoUrl">
						{(field) => (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<FormLabel className="text-base">Logo</FormLabel>
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
												alt="Logo de l'organisation"
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
											endpoint="organizationLogo"
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
														"Impossible de charger l'image. Veuillez réessayer.",
												});
											}}
											className="border-2 border-dashed border-muted-foreground/25 h-44 rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-300 ut-label:text-sm ut-allowed-content:hidden hover:border-primary/30 ut-container:cursor-pointer ut-button:bg-primary ut-button:hover:bg-primary/90"
										/>

										{isUploading && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-[2px] rounded-lg transition-all duration-300">
												<div className="flex items-center gap-3 flex-col">
													<GridLoader color="primary" size="xs" />
													<div className="text-sm font-medium text-primary/80 flex items-center gap-2">
														<span>Chargement</span>
														<MiniDotsLoader color="primary" size="xs" />
													</div>
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
				</FormSection>

				{/* Section 1: Informations de base */}
				<FormSection
					title="Informations de base"
					description="Renseignez les informations principales de l'organisation"
					icon={Building2}
				>
					<div className="space-y-4">
						<form.AppField
							name="name"
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
									label="Nom commercial"
									disabled={isPending}
									placeholder="Nom utilisé au quotidien"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="legalName"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La dénomination sociale est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Dénomination sociale"
									disabled={isPending}
									placeholder="Dénomination sociale"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="legalForm"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La forme juridique est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Forme juridique"
									disabled={isPending}
									placeholder="Sélectionnez une forme juridique"
									options={LEGAL_FORM_OPTIONS.map((option) => ({
										label: option.label,
										value: option.value,
									}))}
								/>
							)}
						</form.AppField>

						<form.AppField
							name="legalForm"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La forme juridique est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Forme juridique"
									disabled={isPending}
									placeholder="Sélectionnez une forme juridique"
									options={LEGAL_FORM_OPTIONS.map((option) => ({
										label: option.label,
										value: option.value,
									}))}
								/>
							)}
						</form.AppField>

						<form.AppField
							name="legalForm"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La forme juridique est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Forme juridique"
									disabled={isPending}
									placeholder="Sélectionnez une forme juridique"
									options={LEGAL_FORM_OPTIONS.map((option) => ({
										label: option.label,
										value: option.value,
									}))}
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
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 2: Identifiants fiscaux */}
				<FormSection
					title="Identifiants fiscaux"
					description="Renseignez les identifiants fiscaux de l'organisation"
					icon={Receipt}
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
					</div>
				</FormSection>

				{/* Section 3: Adresse */}
				<FormSection
					title="Adresse"
					description="Indiquez l'adresse de l'organisation"
					icon={MapPin}
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

										// Ajouter des paramètres supplémentaires si nécessaire
										// Par exemple, si on connaît déjà le code postal
										/*	const postalCode = form.getFieldValue("postalCode");
										if (postalCode) {
											url.set("postcode", postalCode);
										}*/

										// Utiliser un flag pour indiquer si on est dans un onChange manuel
										// ou dans une validation de soumission
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
					</div>
				</FormSection>

				{/* Section 4: Informations complémentaires */}
				<FormSection
					title="Informations complémentaires"
					description="Renseignez les informations complémentaires"
					icon={Globe}
				>
					<div className="space-y-4">
						<form.AppField name="phone">
							{(field) => (
								<field.InputField
									label="Téléphone"
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
									placeholder="Ex: https://www.example.com"
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						cancelHref="/dashboard"
						submitLabel={"Créer l'organisation"}
						isPending={isUploading}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
