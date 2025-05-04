"use client";

import { Button, FormLabel, Input } from "@/shared/components/ui";

import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { Autocomplete } from "@/shared/components/autocomplete";
import {
	FieldInfo,
	FormErrors,
	FormLayout,
	FormSection,
	useAppForm,
} from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import {
	createToastCallbacks,
	generateReference,
	withCallbacks,
} from "@/shared/utils";
import { AddressType, Client, ClientStatus, ClientType } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import {
	Building,
	Clock,
	MapPin,
	Receipt,
	Tag,
	User,
	Wand2,
	X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { use, useActionState, useTransition } from "react";
import { toast } from "sonner";
import { createClient } from "../actions/create-client";
import { createClientSchema } from "../schemas";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export function CreateClientForm({ searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isAddressLoading, startAddressTransition] = useTransition();
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createClient,
			createToastCallbacks<Client, typeof createClientSchema>({
				loadingMessage: "Création du client en cours...",
				onSuccess: (result) => {
					toast.success("Client créé avec succès", {
						description: `Le client "${
							result.data?.name || ""
						}" a été ajouté à votre organisation.`,
						duration: 5000,
						action: {
							label: "Voir le client",
							onClick: () => {
								if (result.data?.id) {
									router.push(
										`/dashboard/${result.data.organizationId}/clients/${result.data.id}`
									);
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
			organizationId,
			name: "",
			reference: "",
			email: "",
			phone: "",
			website: "",
			clientType: ClientType.INDIVIDUAL as ClientType,
			status: ClientStatus.LEAD as ClientStatus,
			notes: "",
			siren: "",
			siret: "",
			vatNumber: "",
			// Adresse principale
			addressType: AddressType.BILLING as AddressType,
			addressLine1: "",
			addressLine2: "",
			postalCode: "",
			city: "",
			country: "France",
			// Coordonnées géographiques
			latitude: null as number | null,
			longitude: null as number | null,
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
			router.push(`/dashboard/${organizationId}/clients/new?${url.toString()}`);
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
		} catch (error) {
			console.error("Erreur lors de la génération de référence", error);
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
			<input type="hidden" name="organizationId" value={organizationId} />
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
				<FormSection
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

									{/* Messages d'aide et erreurs standard */}
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
									disabled={isPending}
									label="Nom"
									placeholder="Nom du client ou de l'entreprise"
									required
								/>
							)}
						</form.AppField>

						<form.AppField name="clientType">
							{(field) => (
								<field.SelectField
									disabled={isPending}
									label="Type de client"
									options={CLIENT_TYPES.map((type) => ({
										value: type.value,
										label: type.label,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 5: Adresse */}
				<FormSection
					title="Adresse de facturation"
					description="Adresse de facturation du client"
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

										const isSubmitting = form.state.isSubmitting;

										if (!isSubmitting) {
											startAddressTransition(() => {
												router.push(
													`/dashboard/${organizationId}/clients/new?${url.toString()}`,
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
									<field.InputField
										label="Code postal"
										placeholder="Ex: 75001"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							<form.AppField name="city">
								{(field) => (
									<field.InputField
										disabled={isPending}
										label="Ville"
										placeholder="Ex: Paris"
									/>
								)}
							</form.AppField>
						</div>
					</div>
				</FormSection>

				{/* Section 4: Informations fiscales */}
				<FormSection
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
														disabled={isPending}
														label="SIREN"
														placeholder="9 chiffres (ex: 123456789)"
													/>
												)}
											</form.AppField>

											<form.AppField name="siret">
												{(field) => (
													<field.InputField
														disabled={isPending}
														label="SIRET"
														placeholder="14 chiffres (ex: 12345678900001)"
													/>
												)}
											</form.AppField>
										</>
									) : (
										<>
											<form.AppField name="siret">
												{(field) => (
													<field.InputField
														disabled={isPending}
														label="SIRET"
														placeholder="14 chiffres (ex: 12345678900001)"
													/>
												)}
											</form.AppField>
											<form.AppField name="siren">
												{(field) => (
													<field.InputField
														disabled={isPending}
														label="SIREN"
														placeholder="9 chiffres (ex: 123456789)"
													/>
												)}
											</form.AppField>
										</>
									)}
								</>
							)}
						</form.Subscribe>

						<form.AppField name="vatNumber">
							{(field) => (
								<field.InputField
									disabled={isPending}
									label="N° TVA"
									placeholder="Format FR + 11 caractères (ex: FR12345678900)"
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 3: Classification */}
				<FormSection
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
				</FormSection>

				{/* Section 2: Informations de contact */}
				<FormSection
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
									placeholder="Ex: contact@example.com"
								/>
							)}
						</form.AppField>

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

				<FormSection
					title="Suivi commercial"
					description="Informations de suivi et qualification"
					icon={Clock}
				>
					<div className="space-y-4">
						<form.AppField name="notes">
							{(field) => (
								<field.TextareaField
									disabled={isPending}
									label="Notes"
									placeholder="Notes et informations complémentaires"
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
						cancelHref={`/dashboard/${organizationId}/clients`}
						submitLabel="Créer le client"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
