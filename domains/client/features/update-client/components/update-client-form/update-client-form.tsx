"use client";

import {
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
} from "@/shared/components/forms";
import { FormLabel } from "@/shared/components/shadcn-ui/form";
import { Input } from "@/shared/components/shadcn-ui/input";
import { Textarea } from "@/shared/components/shadcn-ui/textarea";

import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { GetClientReturn } from "@/domains/client/features/get-client";
import { useCheckReference } from "@/shared/queries";
import { generateReference } from "@/shared/utils/generate-reference";
import { ClientStatus, ClientType } from "@prisma/client";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import { Building, Clock, Receipt, Tag, User, Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import { use, useTransition } from "react";
import { useUpdateClient } from "../../hooks";

type Props = {
	clientPromise: Promise<GetClientReturn>;
};

export function UpdateClientForm({ clientPromise }: Props) {
	const client = use(clientPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const [isCheckingReference, startReferenceTransition] = useTransition();
	const { state, dispatch, isPending } = useUpdateClient();
	const { dispatch: checkReferenceDispatch } = useCheckReference();

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			id: state?.inputs?.id ?? client.id,
			organizationId,
			name: state?.inputs?.name ?? client.name,
			reference: state?.inputs?.reference ?? client.reference,
			email: state?.inputs?.email ?? client.email,
			phone: state?.inputs?.phone ?? client.phone,
			website: state?.inputs?.website ?? client.website,
			clientType: state?.inputs?.clientType ?? client.clientType,
			status: state?.inputs?.status ?? client.status,
			notes: state?.inputs?.notes ?? client.notes,
			siren: state?.inputs?.siren ?? client.siren,
			siret: state?.inputs?.siret ?? client.siret,
			vatNumber: state?.inputs?.vatNumber ?? client.vatNumber,
		},

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
			<form.Field name="id">
				{(field) => (
					<input type="hidden" name="id" value={field.state.value ?? ""} />
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
								onChangeAsync: async ({ value }) => {
									if (form.state.isSubmitting) return undefined;
									if (!value) return undefined;
									checkReference(value);
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
											size="sm"
											disabled={isCheckingReference}
											onClick={handleGenerateReference}
											title="Générer une référence unique"
											className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
										>
											<Wand2 className="h-3 w-3 mr-1" />
											Générer
										</Button>
									</div>

									<Input
										id="reference"
										name="reference"
										placeholder="Référence unique (ex: CLI-001)"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									{/* Message de statut et d'aide */}

									<FieldInfo field={field} />
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
											{CLIENT_TYPES.map((type) => (
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
															value={sirenField.state.value ?? ""}
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
															value={siretField.state.value ?? ""}
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
									) : (
										<>
											<form.Field name="siret">
												{(field) => (
													<input
														type="hidden"
														name="siret"
														value={field.state.value ?? ""}
													/>
												)}
											</form.Field>
											<form.Field name="siren">
												{(field) => (
													<input
														type="hidden"
														name="siren"
														value={field.state.value ?? ""}
													/>
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
										value={field.state.value ?? ""}
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
											{CLIENT_STATUSES.map((status) => (
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
										value={field.state.value ?? ""}
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
										value={field.state.value ?? ""}
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
										value={field.state.value ?? ""}
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
										value={field.state.value ?? ""}
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
						submitLabel="Modifier le client"
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
