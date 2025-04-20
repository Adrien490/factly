"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components";
import { FormLabel, Input, Textarea } from "@/shared/components/ui";

import { COUNTRIES } from "@/domains/address/constants";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { SUPPLIER_STATUSES } from "@/domains/supplier/constants/supplier-statuses";
import { SUPPLIER_TYPES } from "@/domains/supplier/constants/supplier-types";
import { useCreateSupplier } from "@/domains/supplier/features/create-supplier/hooks";
import { Autocomplete } from "@/shared/components/autocomplete";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
} from "@/shared/components/forms";
import { AddressType } from "@prisma/client";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
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
	const form = useForm({
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
					description="Renseignez les informations principales du fournisseur"
					icon={Building}
				>
					<div className="space-y-4">
						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="name" className="flex items-center">
										Nom
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										disabled={isPending}
										id="name"
										name="name"
										placeholder="Nom du fournisseur ou de l'entreprise"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="legalName">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="legalName">Raison sociale</FormLabel>
									<Input
										disabled={isPending}
										id="legalName"
										name="legalName"
										placeholder="Raison sociale ou nom légal"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="supplierType">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="supplierType">
										Type de fournisseur
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										disabled={isPending}
										name="supplierType"
										onValueChange={(value) => {
											field.handleChange(
												value as unknown as Updater<typeof field.state.value>
											);
										}}
										value={field.state.value}
									>
										<SelectTrigger id="supplierType" className="w-full">
											<SelectValue placeholder="Sélectionnez un type" />
										</SelectTrigger>
										<SelectContent>
											{SUPPLIER_TYPES.map((type) => (
												<SelectItem
													key={type.value}
													value={type.value}
													title={type.description}
												>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="status">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="status">
										Statut
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										disabled={isPending}
										name="status"
										onValueChange={(value) => {
											field.handleChange(
												value as unknown as Updater<typeof field.state.value>
											);
										}}
										value={field.state.value}
									>
										<SelectTrigger id="status" className="w-full">
											<SelectValue placeholder="Sélectionnez un statut" />
										</SelectTrigger>
										<SelectContent>
											{SUPPLIER_STATUSES.map((status) => (
												<SelectItem
													key={status.value}
													value={status.value}
													title={status.description}
												>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 2: Adresse */}
				<FormSection
					title="Adresse"
					description="Adresse principale du fournisseur"
					icon={MapPin}
				>
					<div className="space-y-4">
						<form.Field name="addressType">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressType">
										Type d&apos;adresse
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										disabled={isPending}
										name="addressType"
										onValueChange={(value) => {
											field.handleChange(
												value as unknown as Updater<typeof field.state.value>
											);
										}}
										value={field.state.value}
									>
										<SelectTrigger id="addressType" className="w-full">
											<SelectValue placeholder="Sélectionnez un type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={AddressType.BILLING}>
												Facturation
											</SelectItem>
											<SelectItem value={AddressType.SHIPPING}>
												Livraison
											</SelectItem>
											<SelectItem value={AddressType.OTHER}>Autre</SelectItem>
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

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
						</form.Field>

						<form.Field name="addressLine2">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressLine2">Adresse ligne 2</FormLabel>
									<Input
										disabled={isPending}
										id="addressLine2"
										name="addressLine2"
										placeholder="Complément d'adresse"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<form.Field name="postalCode">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="postalCode">Code postal</FormLabel>
										<Input
											disabled={isPending}
											id="postalCode"
											name="postalCode"
											placeholder="Code postal"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.Field name="city">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="city">Ville</FormLabel>
										<Input
											disabled={isPending}
											id="city"
											name="city"
											placeholder="Ville"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="country">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="country">Pays</FormLabel>
									<Select
										disabled={isPending}
										name="country"
										onValueChange={(value) => {
											field.handleChange(
												value as unknown as Updater<typeof field.state.value>
											);
										}}
										value={field.state.value || "FRANCE"}
										defaultValue="FRANCE"
									>
										<SelectTrigger id="country" className="w-full">
											<SelectValue placeholder="Sélectionnez un pays" />
										</SelectTrigger>
										<SelectContent>
											{COUNTRIES.map((country) => (
												<SelectItem
													key={country.value}
													value={country.value}
													title={`${country.label} (${country.iso})`}
												>
													{country.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 3: Coordonnées */}
				<FormSection
					title="Coordonnées"
					description="Informations de contact du fournisseur"
					icon={User}
				>
					<div className="space-y-4">
						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="email">Email</FormLabel>
									<Input
										disabled={isPending}
										id="email"
										name="email"
										type="email"
										placeholder="email@exemple.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="phone">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="phone">Téléphone</FormLabel>
									<Input
										disabled={isPending}
										id="phone"
										name="phone"
										placeholder="0123456789"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="website">Site web</FormLabel>
									<Input
										disabled={isPending}
										id="website"
										name="website"
										placeholder="https://www.exemple.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 4: Informations fiscales */}
				<FormSection
					title="Informations fiscales"
					description="Identifiants fiscaux du fournisseur"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.Field name="siren">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="siren">SIREN</FormLabel>
									<Input
										id="siren"
										name="siren"
										placeholder="123456789"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="siret">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="siret">SIRET</FormLabel>
									<Input
										disabled={isPending}
										id="siret"
										name="siret"
										placeholder="12345678900001"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="vatNumber">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="vatNumber">Numéro de TVA</FormLabel>
									<Input
										disabled={isPending}
										id="vatNumber"
										name="vatNumber"
										placeholder="FR12345678900"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
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
						<form.Field name="notes">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="notes">Notes</FormLabel>
									<Textarea
										disabled={isPending}
										id="notes"
										name="notes"
										placeholder="Informations complémentaires sur le fournisseur"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="min-h-[120px]"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
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
