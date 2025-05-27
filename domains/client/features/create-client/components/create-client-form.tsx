"use client";

import { Button, FormLabel, Input } from "@/shared/components/ui";

import { COUNTRY_OPTIONS } from "@/domains/address/constants/country-options";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import {
	CLIENT_STATUS_OPTIONS,
	CLIENT_TYPE_OPTIONS,
} from "@/domains/client/constants";
import {
	BUSINESS_SECTOR_OPTIONS,
	EMPLOYEE_COUNT_OPTIONS,
} from "@/domains/company/constants";
import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
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
import {
	createToastCallbacks,
	generateReference,
	withCallbacks,
} from "@/shared/utils";
import {
	AddressType,
	Client,
	ClientStatus,
	ClientType,
	Country,
	EmployeeCount,
} from "@prisma/client";
import { mergeForm, useStore, useTransform } from "@tanstack/react-form";
import { Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useActionState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "../actions/create-client";
import { createClientSchema } from "../schemas/create-client-schema";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export function CreateClientForm({ searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const [isAddressLoading, startAddressTransition] = useTransition();
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createClient,
			createToastCallbacks<Client, typeof createClientSchema>({
				loadingMessage: "Création du client en cours...",
				onSuccess: (result) => {
					toast.success("Client créé avec succès", {
						description: `Le client a été ajouté à votre organisation.`,
						duration: 5000,
						action: {
							label: "Voir le client",
							onClick: () => {
								if (result.data?.id) {
									router.push(`/dashboard/clients/${result.data.id}`);
								}
							},
						},
					});
					form.reset();
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			reference: state?.inputs?.reference ?? "",
			companyEmail: state?.inputs?.companyEmail ?? "",
			contactEmail: state?.inputs?.contactEmail ?? "",
			contactPhoneNumber: state?.inputs?.contactPhoneNumber ?? "",
			contactMobileNumber: state?.inputs?.contactMobileNumber ?? "",
			contactFaxNumber: state?.inputs?.contactFaxNumber ?? "",
			contactCivility: state?.inputs?.contactCivility ?? "",
			contactFirstName: state?.inputs?.contactFirstName ?? "",
			contactLastName: state?.inputs?.contactLastName ?? "",
			contactFunction: state?.inputs?.contactFunction ?? "",
			contactWebsite: state?.inputs?.contactWebsite ?? "",
			contactNotes: state?.inputs?.contactNotes ?? "",
			companyLegalForm: state?.inputs?.companyLegalForm ?? "",
			type: ClientType.INDIVIDUAL as ClientType,
			status: ClientStatus.ACTIVE as ClientStatus,
			companySiren: state?.inputs?.companySiren ?? "",
			companySiret: state?.inputs?.companySiret ?? "",
			companyNafApeCode: state?.inputs?.companyNafApeCode ?? "",
			companyVatNumber: state?.inputs?.companyVatNumber ?? "",
			companyBusinessSector: state?.inputs?.companyBusinessSector ?? "",
			companyCapital: state?.inputs?.companyCapital ?? "",
			companyRcs: state?.inputs?.companyRcs ?? "",
			companyEmployeeCount: EmployeeCount.ONE_TO_TWO,
			companyName: state?.inputs?.companyName ?? "",

			// Adresse principale
			addressType:
				state?.inputs?.addressType ?? (AddressType.BILLING as AddressType),
			addressLine1: state?.inputs?.addressLine1 ?? "",
			addressLine2: state?.inputs?.addressLine2 ?? "",
			postalCode: state?.inputs?.postalCode ?? "",
			city: state?.inputs?.city ?? "",
			country: Country.FRANCE as Country,
			// Coordonnées géographiques
			latitude: state?.inputs?.latitude ?? (null as number | null),
			longitude: state?.inputs?.longitude ?? (null as number | null),
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
			router.push(`/dashboard/clients/new?${url.toString()}`);
		});
	};

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

			{/* Champs cachés */}

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
									<field.RadioGroupField
										disabled={isPending}
										label="Type de client"
										options={CLIENT_TYPE_OPTIONS}
										onValueChangeCallback={(value) => {
											if (value === ClientType.INDIVIDUAL) {
												form.resetField("companyName");
											} else if (
												value === ClientType.COMPANY &&
												form.getFieldValue("companyName") === ""
											) {
												form.resetField("contactLastName");
											}
										}}
									/>
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
										value={field.state.value}
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
									rows={6}
									placeholder="Notes et informations complémentaires"
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
										label="Email de l'entreprise"
										disabled={isPending}
										placeholder="Ex: contact@example.com"
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

				{/* Section 5: Adresse */}
				<ContentCard
					title="Adresse de facturation"
					description="Adresse de facturation du client"
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
													`/dashboard/clients/new?${url.toString()}`,
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
						cancelHref={`/dashboard/clients`}
						submitLabel="Créer le client"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
