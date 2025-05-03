"use client";

import { FormLabel } from "@/shared/components/ui";

import { ADDRESS_TYPES, COUNTRIES } from "@/domains/address/constants";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { SUPPLIER_STATUSES } from "@/domains/supplier/constants/supplier-statuses";
import { SUPPLIER_TYPES } from "@/domains/supplier/constants/supplier-types";
import { useCreateSupplier } from "@/domains/supplier/features/create-supplier/hooks/use-create-supplier";
import { Autocomplete } from "@/shared/components/autocomplete";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
	useAppForm,
} from "@/shared/components/forms";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { Building, Globe, MapPin, Receipt, User, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { use, useTransition } from "react";
import { formOpts } from "./constants";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export function CreateSupplierForm({ searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isAddressLoading, startAddressTransition] = useTransition();
	const { state, dispatch, isPending } = useCreateSupplier();
	const router = useRouter();

	// TanStack Form setup
	const form = useAppForm({
		...formOpts(organizationId),

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

		// Définir le pays en fonction des données de l'API
		// L'API française retourne principalement des adresses en France
		form.setFieldValue("country", "FRANCE");
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
			router.push(
				`/dashboard/${organizationId}/suppliers/new?${url.toString()}`
			);
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
			<input type="hidden" name="organizationId" value={organizationId} />
			<form.AppField name="latitude">
				{(field) => (
					<input
						type="hidden"
						name="latitude"
						value={field.state.value ?? ""}
					/>
				)}
			</form.AppField>
			<form.AppField name="longitude">
				{(field) => (
					<input
						type="hidden"
						name="longitude"
						value={field.state.value ?? ""}
					/>
				)}
			</form.AppField>
			<form.AppField name="addressType">
				{(field) => (
					<input
						type="hidden"
						name="addressType"
						value={field.state.value ?? ""}
					/>
				)}
			</form.AppField>

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section 1: Informations de base */}
				<FormSection
					title="Informations de base"
					description="Renseignez les informations principales du fournisseur"
					icon={Building}
				>
					<div className="space-y-4">
						<form.AppField
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom du fournisseur est requis";
									if (value.length < 1) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Nom du fournisseur"
									disabled={isPending}
									placeholder="Nom du fournisseur"
								/>
							)}
						</form.AppField>

						<form.AppField name="legalName">
							{(field) => (
								<field.InputField
									label="Raison sociale"
									disabled={isPending}
									placeholder="Raison sociale ou nom légal"
								/>
							)}
						</form.AppField>

						<form.AppField name="supplierType">
							{(field) => (
								<field.SelectField
									label="Type de fournisseur"
									disabled={isPending}
									placeholder="Sélectionnez un type de fournisseur"
									options={SUPPLIER_TYPES.map((type) => ({
										label: type.label,
										value: type.value,
									}))}
								/>
							)}
						</form.AppField>

						<form.AppField name="status">
							{(field) => (
								<field.SelectField
									label="Statut"
									disabled={isPending}
									placeholder="Sélectionnez un statut"
									options={SUPPLIER_STATUSES.map((status) => ({
										label: status.label,
										value: status.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 2: Adresse */}
				<FormSection
					title="Adresse"
					description="Adresse principale du fournisseur"
					icon={MapPin}
				>
					<div className="space-y-4">
						<form.AppField name="addressType">
							{(field) => (
								<field.SelectField
									label="Type d'adresse"
									disabled={isPending}
									placeholder="Sélectionnez un type d'adresse"
									options={ADDRESS_TYPES.map((type) => ({
										label: type.label,
										value: type.value,
									}))}
								/>
							)}
						</form.AppField>

						<form.AppField
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

										// Utiliser un flag pour indiquer si on est dans un onChange manuel
										// ou dans une validation de soumission
										const isSubmitting = form.state.isSubmitting;

										if (!isSubmitting) {
											startAddressTransition(() => {
												router.push(
													`/dashboard/${organizationId}/suppliers/new?${url.toString()}`,
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
										/>

										{field.state.value && (
											<button
												type="button"
												className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
												onClick={handleClearAddressSearch}
											>
												<X className="h-4 w-4" />
												<span className="sr-only">Effacer</span>
											</button>
										)}
									</div>
									<FieldInfo field={field} />
								</div>
							)}
						</form.AppField>

						<form.AppField name="addressLine2">
							{(field) => (
								<field.InputField
									label="Adresse ligne 2"
									disabled={isPending}
									placeholder="Complément d'adresse"
								/>
							)}
						</form.AppField>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
									options={COUNTRIES.map((country) => ({
										label: country.label,
										value: country.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 3: Coordonnées */}
				<FormSection
					title="Coordonnées"
					description="Informations de contact du fournisseur"
					icon={User}
				>
					<div className="space-y-4">
						<form.AppField
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (value && !/^\S+@\S+\.\S+$/.test(value)) {
										return "L&apos;email doit être valide";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Email"
									disabled={isPending}
									placeholder="Email"
								/>
							)}
						</form.AppField>

						<form.AppField name="phone">
							{(field) => (
								<field.InputField
									label="Téléphone"
									disabled={isPending}
									placeholder="Téléphone"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="website"
							validators={{
								onChange: ({ value }) => {
									if (
										value &&
										!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
											value
										)
									) {
										return "L&apos;URL doit être valide";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Site web"
									disabled={isPending}
									placeholder="Site web"
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 4: Informations fiscales */}
				<FormSection
					title="Informations fiscales"
					description="Identifiants fiscaux du fournisseur"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.AppField name="siren">
							{(field) => (
								<field.InputField
									label="SIREN"
									disabled={isPending}
									placeholder="SIREN"
								/>
							)}
						</form.AppField>

						<form.AppField name="siret">
							{(field) => (
								<field.InputField
									label="SIRET"
									disabled={isPending}
									placeholder="SIRET"
								/>
							)}
						</form.AppField>

						<form.AppField name="vatNumber">
							{(field) => (
								<field.InputField
									label="Numéro de TVA"
									disabled={isPending}
									placeholder="Numéro de TVA"
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 5: Notes */}
				<FormSection
					title="Notes"
					description="Informations complémentaires sur le fournisseur"
					icon={Globe}
					className="col-span-full"
				>
					<div className="space-y-4">
						<form.AppField name="notes">
							{(field) => (
								<field.TextareaField
									label="Notes"
									disabled={isPending}
									placeholder="Notes"
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>
			</FormLayout>

			{/* Boutons d'action */}
			<FormFooter
				cancelHref={`/dashboard/${organizationId}/suppliers`}
				submitLabel="Créer le fournisseur"
			/>
		</form>
	);
}
