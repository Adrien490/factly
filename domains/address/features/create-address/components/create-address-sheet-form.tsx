"use client";

import { AddressTypeOption } from "@/domains/address/constants/address-type-options";
import { COUNTRY_OPTIONS } from "@/domains/address/constants/country-options";
import {
	FormattedAddressResult,
	SearchAddressReturn,
} from "@/domains/address/features/search-address";
import { Autocomplete } from "@/shared/components/autocomplete";
import { FieldInfo, FormErrors, useAppForm } from "@/shared/components/forms";
import {
	Button,
	FormLabel,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Address, AddressType, Country } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode, use, useActionState, useState, useTransition } from "react";
import { toast } from "sonner";
import { createAddress } from "../actions/create-address";
import { createAddressSchema } from "../schemas";

interface CreateAddressSheetFormProps {
	addressTypes: AddressTypeOption[];
	children?: ReactNode;
	searchAddressPromise: Promise<SearchAddressReturn>;
}

export function CreateAddressSheetForm({
	addressTypes,
	children,
	searchAddressPromise,
}: CreateAddressSheetFormProps) {
	const response = use(searchAddressPromise);
	const [isOpen, setIsOpen] = useState(false);
	const params = useParams();

	const clientId = params.clientId as string;
	const supplierId = params.supplierId as string;
	const pathname = usePathname();
	const organizationId = params.organizationId as string;

	const [isAddressLoading, startAddressTransition] = useTransition();
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createAddress,
			createToastCallbacks<Address, typeof createAddressSchema>({
				loadingMessage: "Création de l'adresse en cours...",
				onSuccess: (data) => {
					form.reset();
					setIsOpen(false);
					toast.success(data?.message);
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			organizationId,
			addressType: AddressType.BILLING as AddressType,
			addressLine1: "",
			addressLine2: "",
			postalCode: "",
			city: "",
			country: Country.FRANCE as Country,
			isDefault: false,
			latitude: null as number | null,
			longitude: null as number | null,
			clientId: clientId || undefined,
			supplierId: supplierId || undefined,
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
			router.push(`${pathname}?${url.toString()}`, {
				scroll: false,
			});
		});
	};

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{children || <Button className="shrink-0">Nouvelle adresse</Button>}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Nouvelle adresse</SheetTitle>
				</SheetHeader>

				<form
					action={dispatch}
					className="mt-2"
					onSubmit={() => form.handleSubmit()}
				>
					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Champs cachés */}
					<form.AppField name="organizationId">
						{(field) => (
							<input
								type="hidden"
								name="organizationId"
								value={field.state.value}
							/>
						)}
					</form.AppField>
					{clientId && (
						<form.AppField name="clientId">
							{(field) => (
								<input
									type="hidden"
									name="clientId"
									value={field.state.value}
								/>
							)}
						</form.AppField>
					)}
					{supplierId && (
						<form.AppField name="supplierId">
							{(field) => (
								<input
									type="hidden"
									name="supplierId"
									value={field.state.value}
								/>
							)}
						</form.AppField>
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

					<div className="space-y-5 overflow-y-auto max-h-[calc(100vh-16rem)]">
						{/* Type d'adresse et option par défaut */}
						<div className="space-y-4">
							<form.AppField
								name="addressType"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "Le type d'adresse est requis";
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.SelectField
										label="Type d'adresse"
										required
										disabled={isPending}
										options={addressTypes.map((type) => ({
											value: type.value,
											label: type.label,
										}))}
									/>
								)}
							</form.AppField>

							<form.AppField name="isDefault">
								{(field) => (
									<field.CheckboxField
										label="Définir comme adresse par défaut"
										disabled={isPending}
									/>
								)}
							</form.AppField>
						</div>

						{/* Recherche d'adresse */}
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

										startAddressTransition(() => {
											router.push(`${pathname}?${url.toString()}`, {
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
												disabled={isPending}
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
													La recherche doit commencer par une lettre ou un
													chiffre
												</p>
											)}
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.AppField name="addressLine2">
								{(field) => (
									<field.InputField
										label="Complément d'adresse"
										placeholder="Appartement, étage, etc."
										disabled={isPending}
									/>
								)}
							</form.AppField>
						</div>

						{/* Code postal et ville */}
						<div className="grid grid-cols-2 gap-4">
							<form.AppField
								name="postalCode"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "Le code postal est requis";
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Code postal"
										placeholder="Code postal"
										required
										disabled={isPending}
									/>
								)}
							</form.AppField>

							<form.AppField
								name="city"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "La ville est requise";
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Ville"
										placeholder="Ville"
										required
										disabled={isPending}
									/>
								)}
							</form.AppField>
						</div>

						{/* Pays */}
						<form.AppField
							name="country"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le pays est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Pays"
									required
									disabled={isPending}
									options={COUNTRY_OPTIONS}
								/>
							)}
						</form.AppField>
					</div>

					{/* Bouton de soumission */}
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button
								type="submit"
								className="w-full mt-4"
								disabled={!canSubmit || isPending}
							>
								Créer l&apos;adresse
							</Button>
						)}
					</form.Subscribe>
				</form>
			</SheetContent>
		</Sheet>
	);
}
