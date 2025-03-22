"use client";

import { Button } from "@/shared/components/ui/button";
import { FormLabel } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { SearchAddressReturn } from "@/shared/components/autocomplete/queries/search-address";
import { FormattedAddressResult } from "@/shared/components/autocomplete/types";
import { FormErrors } from "@/shared/components/forms/components/form-errors";
import { FormFooter } from "@/shared/components/forms/components/form-footer";
import { FormLayout } from "@/shared/components/forms/components/form-layout";
import { FormSection } from "@/shared/components/forms/components/form-section";

import formOpts from "@/app/dashboard/[organizationId]/clients/new/lib/form-options";
import { clientPriorities } from "@/features/clients/constants/client-priorities";
import { clientStatuses } from "@/features/clients/constants/client-statuses";
import { clientTypes } from "@/features/clients/constants/client-types";
import useCheckClientReference from "@/features/clients/hooks/use-check-client-reference";
import useCreateClient from "@/features/clients/hooks/use-create-client";
import { generateReference } from "@/features/clients/utils/generate-reference";
import { Autocomplete } from "@/shared/components/autocomplete";
import { FieldInfo } from "@/shared/components/forms/components/field-info";
import { Loader } from "@/shared/components/loader";
import { ClientStatus, ClientType } from "@prisma/client";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
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
import { use, useTransition } from "react";

type Props = {
	searchAddressPromise: Promise<SearchAddressReturn>;
};

export default function CreateClientForm({ searchAddressPromise }: Props) {
	const response = use(searchAddressPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isCheckingReference, startReferenceTransition] = useTransition();
	const [isAddressLoading, startAddressTransition] = useTransition();
	const { state, dispatch, isPending } = useCreateClient();
	const router = useRouter();
	const { state: checkReferenceState, dispatch: checkReferenceDispatch } =
		useCheckClientReference();

	// TanStack Form setup
	const form = useForm({
		...formOpts(organizationId),

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Fonction pour générer une référence automatique
	const handleGenerateReference = async () => {
		try {
			const reference = await generateReference({
				prefix: "CLI",
				format: "alphanumeric",
				length: 2,
				separator: "-",
			});

			form.setFieldValue("reference", reference);
			const formData = new FormData();
			formData.set("reference", reference);
			formData.set("organizationId", organizationId);
			startReferenceTransition(() => checkReferenceDispatch(formData));
		} catch {
			// Silencieusement gérer l'erreur sans afficher de toast
			console.error("Erreur lors de la génération de référence");
		}
	};

	// Fonction pour vérifier la disponibilité d'une référence
	const checkReference = (reference: string) => {
		if (reference && reference.length >= 3) {
			const formData = new FormData();
			formData.set("reference", reference);
			formData.set("organizationId", organizationId);

			// Toujours utiliser startReferenceTransition
			startReferenceTransition(() => {
				checkReferenceDispatch(formData);
			});
		}
	};

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

			<FormLayout withDividers spacing="compact" columns={2} className="mt-6">
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
								onChangeAsync: async ({ value }) => {
									if (form.state.isSubmitting) return undefined;
									checkReference(value);
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="reference">
										Référence
										<span className="text-destructive ml-1">*</span>
									</FormLabel>

									<div className="flex gap-2">
										<div className="relative flex-1">
											<Input
												id="reference"
												name="reference"
												placeholder="Référence unique (ex: CLI-001)"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
											/>
										</div>
										<Button
											type="button"
											variant="outline"
											size="icon"
											disabled={isCheckingReference}
											onClick={handleGenerateReference}
											title="Générer une référence unique"
										>
											<Wand2 className="h-4 w-4" />
										</Button>
									</div>

									{/* Message de statut et d'aide */}
									<div className="min-h-5">
										<FieldInfo field={field} />

										{field.state.value &&
											field.state.value.length >= 3 &&
											isCheckingReference &&
											!form.state.isSubmitting && (
												<Loader
													align="start"
													text="Vérification de la disponibilité..."
													variant="dots"
													color="primary"
													size="xs"
												/>
											)}

										{!isCheckingReference &&
											field.state.value &&
											field.state.value.length >= 3 &&
											checkReferenceState?.data !== undefined &&
											checkReferenceState?.data?.reference ===
												field.state.value && (
												<p className="text-xs font-medium">
													{checkReferenceState?.data?.exists ? (
														<span className="text-destructive">
															Cette référence est déjà utilisée
														</span>
													) : (
														<span className="text-green-500">
															Cette référence est disponible
														</span>
													)}
												</p>
											)}
									</div>
								</div>
							)}
						</form.Field>

						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="name" className="flex items-center">
										Nom
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="name"
										name="name"
										placeholder="Nom du client ou de l'entreprise"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="clientType">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="clientType">
										Type de client
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										name="clientType"
										onValueChange={(value) => {
											field.handleChange(value as Updater<ClientType>);
										}}
										value={field.state.value}
									>
										<SelectTrigger id="clientType">
											<SelectValue placeholder="Sélectionnez un type" />
										</SelectTrigger>
										<SelectContent>
											{clientTypes.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
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
												router.push(
													`/dashboard/${organizationId}/clients/new?${url.toString()}`
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

						<form.Field name="addressLine2">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="addressLine2">
										Adresse ligne 2 (optionnelle)
									</FormLabel>
									<Input
										id="addressLine2"
										name="addressLine2"
										placeholder="Complément d'adresse, étage, etc."
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-4">
							<form.Field name="postalCode">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="postalCode">Code postal</FormLabel>
										<Input
											id="postalCode"
											name="postalCode"
											placeholder="Ex: 75001"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										{field.state.meta.errors.length > 0 && (
											<p className="text-xs text-destructive">
												{String(field.state.meta.errors[0])}
											</p>
										)}
									</div>
								)}
							</form.Field>

							<form.Field name="city">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="city">Ville</FormLabel>
										<Input
											id="city"
											name="city"
											placeholder="Ex: Paris"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
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
									{clientType === ClientType.COMPANY && (
										<>
											<form.Field name="siren">
												{(sirenField) => (
													<div className="space-y-1.5">
														<FormLabel
															htmlFor="siren"
															className="flex items-center"
														>
															SIREN
														</FormLabel>
														<Input
															id="siren"
															name="siren"
															placeholder="9 chiffres (ex: 123456789)"
															value={sirenField.state.value}
															onChange={(e) =>
																sirenField.handleChange(e.target.value)
															}
														/>
														<p className="text-xs text-muted-foreground">
															Identifiant d&apos;entreprise à 9 chiffres
														</p>
														<FieldInfo field={sirenField} />
													</div>
												)}
											</form.Field>

											<form.Field name="siret">
												{(siretField) => (
													<div className="space-y-1.5">
														<FormLabel
															htmlFor="siret"
															className="flex items-center"
														>
															SIRET
														</FormLabel>
														<Input
															id="siret"
															name="siret"
															placeholder="14 chiffres (ex: 12345678900001)"
															value={siretField.state.value}
															onChange={(e) =>
																siretField.handleChange(e.target.value)
															}
														/>
														<p className="text-xs text-muted-foreground">
															Identifiant d&apos;établissement à 14 chiffres
														</p>
														<FieldInfo field={siretField} />
													</div>
												)}
											</form.Field>
										</>
									)}
								</>
							)}
						</form.Subscribe>

						<form.Field name="vatNumber">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="vatNumber" className="flex items-center">
										N° TVA
									</FormLabel>
									<Input
										id="vatNumber"
										name="vatNumber"
										placeholder="Format FR + 11 caractères (ex: FR12345678900)"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<p className="text-xs text-muted-foreground">
										Numéro de TVA intracommunautaire
									</p>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 3: Classification */}
				<FormSection
					title="Classification"
					description="Catégorisation et statut du client"
					icon={Tag}
				>
					<div className="space-y-4">
						<form.Field
							name="status"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le statut est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="status">
										Statut
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										onValueChange={(value) => {
											field.handleChange(value as Updater<ClientStatus>);
										}}
										name="status"
										value={field.state.value}
									>
										<SelectTrigger
											id="status"
											className="border-input focus:ring-1 focus:ring-primary"
										>
											<SelectValue placeholder="Sélectionnez un statut" />
										</SelectTrigger>
										<SelectContent>
											{clientStatuses.map((status) => (
												<SelectItem key={status.value} value={status.value}>
													{status.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="priority">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="priority">Priorité</FormLabel>
									<Select name="priority" value={field.state.value}>
										<SelectTrigger id="priority">
											<SelectValue placeholder="Sélectionnez une priorité" />
										</SelectTrigger>
										<SelectContent>
											{clientPriorities.map((priority) => (
												<SelectItem key={priority.value} value={priority.value}>
													{priority.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{field.state.meta.errors.length > 0 && (
										<p className="text-xs text-destructive">
											{String(field.state.meta.errors[0])}
										</p>
									)}
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 2: Informations de contact */}
				<FormSection
					title="Informations de contact"
					description="Coordonnées du client"
					icon={User}
				>
					<div className="space-y-4">
						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="email" className="flex items-center">
										Email
									</FormLabel>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="contact@example.com"
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
									<FormLabel htmlFor="phone" className="flex items-center">
										Téléphone
									</FormLabel>
									<Input
										id="phone"
										name="phone"
										placeholder="Ex: +33 1 23 45 67 89"
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="website">Site web</FormLabel>
									<Input
										id="website"
										name="website"
										placeholder="Ex: https://www.example.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				<FormSection
					title="Suivi commercial"
					description="Informations de suivi et qualification"
					icon={Clock}
				>
					<div className="space-y-4">
						<form.Field name="notes">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="notes">Notes</FormLabel>
									<Textarea
										id="notes"
										name="notes"
										rows={4}
										placeholder="Notes et informations complémentaires"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit}
						cancelHref={`/dashboard/${organizationId}/clients`}
						submitLabel="Créer le client"
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
