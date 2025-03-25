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

import { FormErrors } from "@/shared/components/forms/components/form-errors";
import { FormFooter } from "@/shared/components/forms/components/form-footer";
import { FormLayout } from "@/shared/components/forms/components/form-layout";
import { FormSection } from "@/shared/components/forms/components/form-section";

import { SearchAddressReturn } from "@/features/address-api/queries/search-address";
import { FormattedAddressResult } from "@/features/address-api/types";
import { useCreateOrganization } from "@/features/organizations/create";
import { LEGAL_FORM_OPTIONS } from "@/features/organizations/legal-form-options";
import { Autocomplete } from "@/shared/components/autocomplete";
import { FieldInfo } from "@/shared/components/forms/components/field-info";
import { useToast } from "@/shared/hooks/use-toast";
import { UploadDropzone, useUploadThing } from "@/shared/lib/uploadthing";
import { ServerActionStatus } from "@/shared/types/server-action";
import { LegalForm } from "@prisma/client";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import {
	Building2,
	Globe,
	Loader2,
	MapPin,
	Receipt,
	Upload,
	X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useTransition } from "react";

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
	const { toast } = useToast();

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			id: "",
			name: "",
			legalName: "",
			legalForm: undefined as LegalForm | undefined,
			email: "",
			siren: "",
			siret: "",
			vatNumber: "",
			addressLine1: "",
			addressLine2: "",
			postalCode: "",
			city: "",
			country: "France",
			phone: "",
			website: "",
			logoUrl: "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Toast de suivi pour l'action du formulaire
	useEffect(() => {
		if (!isPending && state && state.status === ServerActionStatus.SUCCESS) {
			toast({
				title: "Organisation créée",
				description: state?.message,
			});

			setTimeout(() => {
				router.push(`/dashboard`);
			}, 500);
		}
	}, [isPending, state, toast, router]);

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
			<input type="hidden" name="id" value={""} />
			<form.Field name="logoUrl">
				{(field) => (
					<input type="hidden" name="logoUrl" value={field.state.value ?? ""} />
				)}
			</form.Field>

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
												toast({
													title: "Erreur lors de l'upload",
													description:
														"Impossible de charger l'image. Veuillez réessayer.",
												});
											}}
											className="border-2 border-dashed border-muted-foreground/25 h-32 rounded-md bg-muted/10 hover:bg-muted/20 transition-colors ut-label:text-sm ut-allowed-content:hidden"
										/>
										{isUploading && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-md">
												<div className="flex items-center gap-2">
													<Loader2 className="h-5 w-5 animate-spin text-primary" />
													<p className="text-sm">Chargement...</p>
												</div>
											</div>
										)}
									</div>
								)}
								<p className="text-xs text-muted-foreground">
									JPG, PNG ou SVG. Max. 2MB.
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
						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="name" className="flex items-center">
										Nom commercial
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="name"
										name="name"
										placeholder="Nom utilisé au quotidien"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
							name="legalName"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La dénomination sociale est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="legalName" className="flex items-center">
										Dénomination sociale
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="legalName"
										name="legalName"
										placeholder="Nom juridique officiel"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
							name="legalForm"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La forme juridique est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="legalForm" className="flex items-center">
										Forme juridique
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										name="legalForm"
										onValueChange={(value) => {
											field.handleChange(
												value as Updater<LegalForm | undefined>
											);
										}}
										value={field.state.value}
									>
										<SelectTrigger
											id="legalForm"
											className="border-input focus:ring-1 focus:ring-primary"
										>
											<SelectValue placeholder="Sélectionnez une forme juridique" />
										</SelectTrigger>
										<SelectContent>
											{LEGAL_FORM_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
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
								<div className="space-y-1.5">
									<FormLabel htmlFor="email" className="flex items-center">
										Email de contact
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="contact@exemple.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 2: Identifiants fiscaux */}
				<FormSection
					title="Identifiants fiscaux"
					description="Renseignez les identifiants fiscaux de l'organisation"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.Field
							name="siren"
							validators={{
								onChange: ({ value }) => {
									if (value && !/^\d{9}$/.test(value)) {
										return "Le SIREN doit contenir 9 chiffres";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="siren" className="flex items-center">
										SIREN
									</FormLabel>
									<Input
										id="siren"
										name="siren"
										placeholder="9 chiffres (ex: 123456789)"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<p className="text-xs text-muted-foreground">
										Identifiant d&apos;entreprise à 9 chiffres
									</p>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
							name="siret"
							validators={{
								onChange: ({ value }) => {
									if (value && !/^\d{14}$/.test(value)) {
										return "Le SIRET doit contenir 14 chiffres";
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="siret" className="flex items-center">
										SIRET
									</FormLabel>
									<Input
										id="siret"
										name="siret"
										placeholder="14 chiffres (ex: 12345678900001)"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<p className="text-xs text-muted-foreground">
										Identifiant d&apos;établissement à 14 chiffres
									</p>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
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
										className="border-input focus:ring-1 focus:ring-primary"
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
												router.push(`/dashboard/new?${url.toString()}`);
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
									<FormLabel
										htmlFor="addressLine2"
										className="flex items-center"
									>
										Complément d&apos;adresse
									</FormLabel>
									<Input
										id="addressLine2"
										name="addressLine2"
										placeholder="Bâtiment, étage, etc."
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-4">
							<form.Field name="postalCode">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel
											htmlFor="postalCode"
											className="flex items-center"
										>
											Code postal
										</FormLabel>
										<Input
											id="postalCode"
											name="postalCode"
											placeholder="Ex: 75000"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="border-input focus:ring-1 focus:ring-primary"
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.Field name="city">
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="city" className="flex items-center">
											Ville
										</FormLabel>
										<Input
											id="city"
											name="city"
											placeholder="Ex: Paris"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											className="border-input focus:ring-1 focus:ring-primary"
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="country">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="country" className="flex items-center">
										Pays
									</FormLabel>
									<Input
										id="country"
										name="country"
										placeholder="France"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section 4: Informations complémentaires */}
				<FormSection
					title="Informations complémentaires"
					description="Renseignez les informations complémentaires"
					icon={Globe}
				>
					<div className="space-y-4">
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
										className="border-input focus:ring-1 focus:ring-primary"
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
									<FormLabel htmlFor="website" className="flex items-center">
										Site web
									</FormLabel>
									<Input
										id="website"
										name="website"
										placeholder="Ex: https://www.example.com"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
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
						cancelHref="/dashboard/organizations"
						submitLabel={"Créer l'organisation"}
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
