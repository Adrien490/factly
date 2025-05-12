"use client";

import { FormLabel } from "@/shared/components/ui";

import { COUNTRY_OPTIONS } from "@/domains/address/constants";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { SUPPLIER_ADDRESS_TYPE_OPTIONS } from "@/domains/supplier/constants";
import { SUPPLIER_STATUS_OPTIONS } from "@/domains/supplier/constants/supplier-status-options";
import { SUPPLIER_TYPE_OPTIONS } from "@/domains/supplier/constants/supplier-type-options";
import { Autocomplete } from "@/shared/components/autocomplete";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import {
	AddressType,
	Supplier,
	SupplierStatus,
	SupplierType,
} from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { use, useActionState, useTransition } from "react";
import { toast } from "sonner";
import { createSupplier } from "../actions/create-supplier";
import { createSupplierSchema } from "../schemas";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export function CreateSupplierForm({ searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isAddressLoading, startAddressTransition] = useTransition();
	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createSupplier,
			createToastCallbacks<Supplier, typeof createSupplierSchema>({
				loadingMessage: "Création du fournisseur en cours...",
				onSuccess: (result) => {
					form.reset();
					toast.success(result.message, {
						action: {
							label: "Voir le fournisseur",
							onClick: () => {
								if (result.data?.id) {
									router.push(
										`/dashboard/${result.data.organizationId}/suppliers/${result.data.id}`
									);
								}
							},
						},
					});
				},
			})
		),
		undefined
	);
	const router = useRouter();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			organizationId,
			name: "",
			legalName: "",
			email: "",
			phone: "",
			website: "",
			siren: "",
			siret: "",
			vatNumber: "",
			supplierType: SupplierType.MANUFACTURER,
			status: SupplierStatus.ACTIVE,
			notes: "",
			addressType: AddressType.BILLING,
			addressLine1: "",
			addressLine2: "",
			postalCode: "",
			city: "",
			country: "France",
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
				<ContentCard
					title="Informations de base"
					description="Renseignez les informations principales du fournisseur"
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
									options={SUPPLIER_TYPE_OPTIONS.map((type) => ({
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
									options={SUPPLIER_STATUS_OPTIONS.map((status) => ({
										label: status.label,
										value: status.value,
									}))}
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{/* Section 2: Adresse */}
				<ContentCard
					title="Adresse"
					description="Adresse principale du fournisseur"
				>
					<div className="space-y-4">
						<form.AppField name="country">
							{(field) => (
								<field.SelectField
									label="Pays"
									disabled={isPending}
									placeholder="Sélectionnez un pays"
									options={COUNTRY_OPTIONS}
								/>
							)}
						</form.AppField>

						<form.AppField name="addressType">
							{(field) => (
								<field.SelectField
									label="Type d'adresse"
									disabled={isPending}
									placeholder="Sélectionnez un type d'adresse"
									options={SUPPLIER_ADDRESS_TYPE_OPTIONS}
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
					</div>
				</ContentCard>

				{/* Section 3: Coordonnées */}
				<ContentCard
					title="Coordonnées"
					description="Informations de contact du fournisseur"
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
				</ContentCard>

				{/* Section 4: Informations fiscales */}
				<ContentCard
					title="Informations fiscales"
					description="Identifiants fiscaux du fournisseur"
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
				</ContentCard>

				{/* Section 5: Notes */}
				<ContentCard
					title="Notes"
					description="Informations complémentaires sur le fournisseur"
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
				</ContentCard>
			</FormLayout>

			{/* Boutons d'action */}
			<FormFooter
				cancelHref={`/dashboard/${organizationId}/suppliers`}
				submitLabel="Créer le fournisseur"
			/>
		</form>
	);
}
