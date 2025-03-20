"use client";

import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { FormFooter } from "@/features/forms/components/form-footer";
import { FormLayout } from "@/features/forms/components/form-layout";
import { FormSection } from "@/features/forms/components/form-section";
import OrganizationFormSchema from "@/features/organizations/schemas/create-organization-schema";
import { useToast } from "@/hooks/use-toast";
import { UploadDropzone, useUploadThing } from "@/lib/uploadthing";
import { ServerActionStatus } from "@/types/server-action";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Organization } from "@prisma/client";
import {
	Building2,
	Globe,
	Loader2,
	MapPin,
	Receipt,
	Upload,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useCreateOrganization from "../hooks/use-create-organization";
import legalFormOptions from "../lib/legal-form-options";

interface OrganizationFormProps {
	organization?: Organization;
}

export default function OrganizationForm({
	organization,
}: OrganizationFormProps) {
	const { state, dispatch, isPending } = useCreateOrganization();
	const { isUploading, startUpload } = useUploadThing("organizationLogo");
	const router = useRouter();
	const { toast } = useToast();

	const [form, fields] = useForm({
		id: "organization-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: OrganizationFormSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		defaultValue: {
			name: state?.data?.name ?? "",
			legalName: state?.data?.legalName ?? "",
			legalForm: state?.data?.legalForm ?? null,
			email: state?.data?.email ?? "",
			siren: state?.data?.siren ?? "",
			siret: state?.data?.siret ?? "",
			vatNumber: state?.data?.vatNumber ?? "",
			addressLine1: state?.data?.addressLine1 ?? "",
			addressLine2: state?.data?.addressLine2 ?? "",
			postalCode: state?.data?.postalCode ?? "",
			city: state?.data?.city ?? "",
			country: state?.data?.country ?? "France",
			phone: state?.data?.phone ?? "",
			website: state?.data?.website ?? "",
			logoUrl: state?.data?.logoUrl ?? "",
		},
	});

	// Contrôle du champ logoUrl pour l'upload
	const logoControl = useInputControl(fields.logoUrl);
	console.log("logoControl", logoControl.value);

	// Toast de suivi pour l'action du formulaire
	useEffect(() => {
		// Si on vient de passer de isPending=true à isPending=false
		// et que le statut est SUCCESS, on affiche un toast de succès
		if (!isPending && state && state.status === ServerActionStatus.SUCCESS) {
			toast({
				title: organization ? "Organisation mise à jour" : "Organisation créée",
				description: state?.message,
			});

			// Redirection vers le dashboard après création

			setTimeout(() => {
				router.push(`/dashboard`);
			}, 500);
		}
	}, [isPending, state, toast, organization, router]);

	return (
		<>
			<ServerActionResponse state={state} />

			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="space-y-6"
			>
				<input type="hidden" name="id" value={organization?.id ?? ""} />
				<input
					type="hidden"
					id={fields.logoUrl.id}
					name={fields.logoUrl.name}
					value={fields.logoUrl.value ?? ""}
				/>

				<FormLayout columns={2} className="mt-6">
					{/* Section Logo */}
					<FormSection
						title="Identité visuelle"
						description="Ajoutez un logo pour identifier votre organisation"
						icon={Upload}
					>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<FormLabel className="text-base">Logo</FormLabel>
								{fields.logoUrl.value && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="text-destructive"
										onClick={() => logoControl.change("")}
									>
										Supprimer
									</Button>
								)}
							</div>

							{fields.logoUrl.value ? (
								<div className="flex items-center justify-center">
									<div className="relative h-24 w-24 rounded-md overflow-hidden">
										<Image
											src={fields.logoUrl.value}
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
											console.log("[ORGANIZATION_FORM]", logoUrl);
											if (logoUrl) {
												logoControl.change(logoUrl);
											}
										}}
										onUploadError={(error) => {
											console.error("[ORGANIZATION_FORM]", error);
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
						</div>
					</FormSection>

					{/* Section 1: Informations de base */}
					<FormSection
						title="Informations de base"
						description="Renseignez les informations principales de l'organisation"
						icon={Building2}
					>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<FormLabel
									htmlFor={fields.name.id}
									className="flex items-center"
								>
									Nom commercial
									<span className="text-destructive ml-1">*</span>
								</FormLabel>
								<Input
									id={fields.name.id}
									name={fields.name.name}
									placeholder="Nom utilisé au quotidien"
									aria-describedby={fields.name.descriptionId}
									aria-invalid={!fields.name.valid}
									defaultValue={organization ? state?.data?.name : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.name.errors && (
									<p
										className="text-sm text-destructive"
										id={fields.name.errorId}
									>
										{fields.name.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="legalName" className="flex items-center">
									Dénomination sociale
									<span className="text-destructive ml-1">*</span>
								</FormLabel>
								<Input
									id="legalName"
									name="legalName"
									placeholder="Nom juridique officiel"
									defaultValue={
										organization ? state?.data?.legalName ?? "" : ""
									}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.legalName?.errors && (
									<p className="text-sm text-destructive">
										{fields.legalName.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="legalForm" className="flex items-center">
									Forme juridique
									<span className="text-destructive ml-1">*</span>
								</FormLabel>
								<Select
									name="legalForm"
									defaultValue={state?.data?.legalForm ?? undefined}
								>
									<SelectTrigger
										id="legalForm"
										className="border-input focus:ring-1 focus:ring-primary"
									>
										<SelectValue placeholder="Sélectionnez une forme juridique" />
									</SelectTrigger>
									<SelectContent>
										{legalFormOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fields.legalForm?.errors && (
									<p className="text-sm text-destructive">
										{fields.legalForm.errors[0]}
									</p>
								)}
							</div>

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
									defaultValue={organization ? state?.data?.email ?? "" : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.email?.errors && (
									<p className="text-sm text-destructive">
										{fields.email.errors[0]}
									</p>
								)}
							</div>
						</div>
					</FormSection>

					{/* Section 2: Identifiants fiscaux */}
					<FormSection
						title="Identifiants fiscaux"
						description="Renseignez les identifiants fiscaux de l'organisation"
						icon={Receipt}
					>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<FormLabel htmlFor="siren" className="flex items-center">
									SIREN
								</FormLabel>
								<Input
									id="siren"
									name="siren"
									placeholder="9 chiffres (ex: 123456789)"
									defaultValue={organization ? state?.data?.siren ?? "" : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.siren?.errors && (
									<p className="text-sm text-destructive">
										{fields.siren.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="siret" className="flex items-center">
									SIRET
								</FormLabel>
								<Input
									id="siret"
									name="siret"
									placeholder="14 chiffres (ex: 12345678900001)"
									defaultValue={organization ? state?.data?.siret ?? "" : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.siret?.errors && (
									<p className="text-sm text-destructive">
										{fields.siret.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="vatNumber" className="flex items-center">
									N° TVA
								</FormLabel>
								<Input
									id="vatNumber"
									name="vatNumber"
									placeholder="Format FR + 11 caractères (ex: FR12345678900)"
									defaultValue={
										organization ? state?.data?.vatNumber ?? "" : ""
									}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.vatNumber?.errors && (
									<p className="text-sm text-destructive">
										{fields.vatNumber.errors[0]}
									</p>
								)}
							</div>
						</div>
					</FormSection>

					{/* Section 3: Adresse */}
					<FormSection
						title="Adresse"
						description="Indiquez l'adresse de l'organisation"
						icon={MapPin}
					>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<FormLabel htmlFor="addressLine1" className="flex items-center">
									Adresse (ligne 1)
								</FormLabel>
								<Input
									id="addressLine1"
									name="addressLine1"
									placeholder="N° et nom de rue"
									defaultValue={
										organization ? state?.data?.addressLine1 ?? "" : ""
									}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.addressLine1?.errors && (
									<p className="text-sm text-destructive">
										{fields.addressLine1.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="addressLine2" className="flex items-center">
									Complément d&apos;adresse
								</FormLabel>
								<Input
									id="addressLine2"
									name="addressLine2"
									placeholder="Bâtiment, étage, etc."
									defaultValue={
										organization ? state?.data?.addressLine2 ?? "" : ""
									}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<FormLabel htmlFor="postalCode" className="flex items-center">
										Code postal
									</FormLabel>
									<Input
										id="postalCode"
										name="postalCode"
										placeholder="Ex: 75000"
										defaultValue={
											organization ? state?.data?.postalCode ?? "" : ""
										}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									{fields.postalCode?.errors && (
										<p className="text-sm text-destructive">
											{fields.postalCode.errors[0]}
										</p>
									)}
								</div>

								<div className="space-y-1.5">
									<FormLabel htmlFor="city" className="flex items-center">
										Ville
									</FormLabel>
									<Input
										id="city"
										name="city"
										placeholder="Ex: Paris"
										defaultValue={organization ? state?.data?.city ?? "" : ""}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
								</div>
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="country" className="flex items-center">
									Pays
								</FormLabel>
								<Input
									id="country"
									name="country"
									placeholder="France"
									defaultValue={
										organization ? state?.data?.country ?? "France" : "France"
									}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
							</div>
						</div>
					</FormSection>

					{/* Section 4: Informations complémentaires */}
					<FormSection
						title="Informations complémentaires"
						description="Renseignez les informations complémentaires"
						icon={Globe}
					>
						<div className="space-y-4">
							<div className="space-y-1.5">
								<FormLabel htmlFor="phone" className="flex items-center">
									Téléphone
								</FormLabel>
								<Input
									id="phone"
									name="phone"
									placeholder="Ex: +33 1 23 45 67 89"
									defaultValue={organization ? state?.data?.phone ?? "" : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.phone?.errors && (
									<p className="text-sm text-destructive">
										{fields.phone.errors[0]}
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<FormLabel htmlFor="website" className="flex items-center">
									Site web
								</FormLabel>
								<Input
									id="website"
									name="website"
									placeholder="Ex: https://www.example.com"
									defaultValue={organization ? state?.data?.website ?? "" : ""}
									className="border-input focus:ring-1 focus:ring-primary"
								/>
								{fields.website?.errors && (
									<p className="text-sm text-destructive">
										{fields.website.errors[0]}
									</p>
								)}
							</div>
						</div>
					</FormSection>
				</FormLayout>

				<FormFooter
					cancelHref="/dashboard/organizations"
					submitLabel={organization ? "Enregistrer" : "Créer l'organisation"}
				/>
			</form>
		</>
	);
}
