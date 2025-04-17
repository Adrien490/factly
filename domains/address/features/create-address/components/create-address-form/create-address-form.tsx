"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components";
import { FormLabel, Input } from "@/shared/components/shadcn-ui";

import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { Autocomplete } from "@/shared/components/autocomplete";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
} from "@/shared/components/forms";
import { ServerActionStatus } from "@/shared/types";
import { AddressType } from "@prisma/client";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import { MapPin, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { useCreateAddress } from "../../hooks";
import { formOpts } from "./constants";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
	clientId?: string;
	supplierId?: string;
	returnUrl?: string; // URL de retour après création
};

export function CreateAddressForm({
	searchAddressPromise,
	clientId,
	supplierId,
	returnUrl,
}: Props) {
	const response = use(searchAddressPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isAddressLoading, startAddressTransition] = useTransition();
	const { state, dispatch, isPending } = useCreateAddress();
	const router = useRouter();

	console.log("state", state);

	// TanStack Form setup
	const form = useForm({
		...formOpts(organizationId, clientId, supplierId),

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
			// Construire l'URL en fonction du contexte
			let baseUrl = `/dashboard/${organizationId}`;
			if (clientId) {
				baseUrl += `/clients/${clientId}/addresses/new`;
			} else if (supplierId) {
				baseUrl += `/suppliers/${supplierId}/addresses/new`;
			} else {
				baseUrl += `/addresses/new`;
			}
			router.push(`${baseUrl}?${url.toString()}`);
		});
	};

	useEffect(() => {
		if (state.status === ServerActionStatus.SUCCESS) {
			form.reset();
			toast.success("Adresse créée avec succès", {
				description: "L'adresse a été créée avec succès",
				duration: 3000,
				action: {
					label: "Retour",
					onClick: () => {
						router.push(returnUrl || `/dashboard/${organizationId}`);
						toast.dismiss();
					},
				},
			});
		}
		return () => {
			toast.dismiss();
		};
	}, [form, state?.message, state.status, router, organizationId, returnUrl]);

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
			{clientId && <input type="hidden" name="clientId" value={clientId} />}
			{supplierId && (
				<input type="hidden" name="supplierId" value={supplierId} />
			)}
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

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section Adresse */}
				<FormSection
					title="Informations d'adresse"
					description="Renseignez les informations de l'adresse"
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
										name="addressType"
										onValueChange={(value) => {
											field.handleChange(
												value as unknown as Updater<typeof field.state.value>
											);
										}}
										value={field.state.value}
										defaultValue={AddressType.BILLING}
									>
										<SelectTrigger id="addressType">
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

						<form.Field name="isDefault">
							{(field) => (
								<div className="space-y-1.5">
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id="isDefault"
											name="isDefault"
											checked={field.state.value || false}
											onChange={(e) => field.handleChange(e.target.checked)}
											className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
										/>
										<FormLabel htmlFor="isDefault" className="cursor-pointer">
											Définir comme adresse par défaut
										</FormLabel>
									</div>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				<FormSection
					title="Détails de l'adresse"
					description="Saisissez les détails de l'adresse"
					icon={MapPin}
				>
					<div className="space-y-4">
						<form.Field
							name="addressLine1"
							validators={{
								onChangeAsyncDebounceMs: 500,
								onChange: ({ value }) => {
									if (!value) return "L'adresse est requise";
									return undefined;
								},
								onChangeAsync: async ({ value }) => {
									if (
										form.state.isSubmitting ||
										!value ||
										value.length < 3 ||
										!/^[a-zA-Z0-9]/.test(value)
									) {
										return;
									}

									const url = new URLSearchParams();
									url.set("q", value);

									// Utiliser le code postal s'il est disponible
									const postalCode = form.getFieldValue("postalCode");
									if (postalCode) {
										url.set("postcode", postalCode);
									}

									// Construire l'URL en fonction du contexte
									let baseUrl = `/dashboard/${organizationId}`;
									if (clientId) {
										baseUrl += `/clients/${clientId}/addresses/new`;
									} else if (supplierId) {
										baseUrl += `/suppliers/${supplierId}/addresses/new`;
									} else {
										baseUrl += `/addresses/new`;
									}

									startAddressTransition(() => {
										router.push(`${baseUrl}?${url.toString()}`, {
											scroll: false,
										});
									});
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressSearchField">
										Rechercher une adresse
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<div className="relative">
										<Autocomplete
											items={response.results}
											onSelect={(item) =>
												handleAddressSelect(item as FormattedAddressResult)
											}
											placeholder="Rechercher une adresse"
											value={field.state.value}
											onChange={(value: string) => field.handleChange(value)}
											className="w-full"
											name="addressLine1"
											getItemLabel={(item) => item.label}
											getItemDescription={(item) =>
												item.postcode && `${item.postcode} ${item.city}`
											}
											isLoading={isAddressLoading}
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

						<form.Field name="addressLine2">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressLine2">
										Complément d&apos;adresse
									</FormLabel>
									<Input
										id="addressLine2"
										name="addressLine2"
										placeholder="Appartement, étage, etc."
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-4">
							<form.Field
								name="postalCode"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "Le code postal est requis";
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="postalCode">
											Code postal
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Input
											id="postalCode"
											name="postalCode"
											placeholder="Code postal"
											value={field.state.value || ""}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.Field
								name="city"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "La ville est requise";
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="city">
											Ville
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Input
											id="city"
											name="city"
											placeholder="Ville"
											value={field.state.value || ""}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
						</div>

						<form.Field
							name="country"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le pays est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="country">
										Pays
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="country"
										name="country"
										placeholder="Pays"
										value={field.state.value || "France"}
										onChange={(e) => field.handleChange(e.target.value)}
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
				submitLabel="Créer l'adresse"
				cancelHref={returnUrl || `/dashboard/${organizationId}`}
				isPending={isPending}
			/>
		</form>
	);
}
