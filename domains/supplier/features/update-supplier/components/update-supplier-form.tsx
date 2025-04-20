"use client";

import {
	FormLabel,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea,
} from "@/shared/components";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
} from "@/shared/components/forms";

import {
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { GetSupplierReturn } from "@/domains/supplier/features/get-supplier";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import { Building, ClipboardEdit, Receipt, Tag } from "lucide-react";
import { useParams } from "next/navigation";
import { use } from "react";
import { useUpdateSupplier } from "../hooks";

type Props = {
	supplierPromise: Promise<GetSupplierReturn>;
};

export function UpdateSupplierForm({ supplierPromise }: Props) {
	const supplier = use(supplierPromise);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateSupplier();

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			id: state?.inputs?.id ?? supplier.id,
			organizationId: state?.inputs?.organizationId ?? supplier.organizationId,
			name: state?.inputs?.name ?? supplier.name,
			legalName: state?.inputs?.legalName ?? (supplier.legalName || ""),
			email: state?.inputs?.email ?? (supplier.email || ""),
			phone: state?.inputs?.phone ?? (supplier.phone || ""),
			website: state?.inputs?.website ?? (supplier.website || ""),
			notes: state?.inputs?.notes ?? (supplier.notes || ""),
			supplierType: state?.inputs?.supplierType ?? supplier.supplierType,
			status: state?.inputs?.status ?? supplier.status,
			siren: state?.inputs?.siren ?? (supplier.siren || ""),
			siret: state?.inputs?.siret ?? (supplier.siret || ""),
			vatNumber: state?.inputs?.vatNumber ?? (supplier.vatNumber || ""),
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	console.log("State:", state);

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
				{/* Section Information de base */}
				<FormSection
					title="Informations de base"
					description="Informations générales sur le fournisseur"
					icon={Building}
				>
					<div className="space-y-4">
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="name">
										Nom du fournisseur
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										disabled={isPending}
										id="name"
										name="name"
										placeholder="Nom du fournisseur"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
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
										placeholder="Raison sociale"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field
							name="supplierType"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le type de fournisseur est requis";
									return undefined;
								},
							}}
						>
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
										value={field.state.value ?? undefined}
									>
										<SelectTrigger id="supplierType">
											<SelectValue placeholder="Sélectionnez un type" />
										</SelectTrigger>
										<SelectContent>
											{SUPPLIER_TYPES.map((type) => (
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
										value={field.state.value ?? undefined}
									>
										<SelectTrigger id="status">
											<SelectValue placeholder="Sélectionnez un statut" />
										</SelectTrigger>
										<SelectContent>
											{SUPPLIER_STATUSES.map((status) => (
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

				{/* Section Coordonnées */}
				<FormSection
					title="Coordonnées"
					description="Informations de contact du fournisseur"
					icon={ClipboardEdit}
				>
					<div className="space-y-4">
						<form.Field name="email">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="email">Email</FormLabel>
									<Input
										disabled={isPending}
										id="email"
										name="email"
										type="email"
										placeholder="Email du fournisseur"
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
									<FormLabel htmlFor="phone">Téléphone</FormLabel>
									<Input
										disabled={isPending}
										id="phone"
										name="phone"
										placeholder="Numéro de téléphone"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="website">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="website">Site web</FormLabel>
									<Input
										disabled={isPending}
										id="website"
										name="website"
										placeholder="Site web"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section Informations fiscales */}
				<FormSection
					title="Informations fiscales"
					description="Informations légales et fiscales"
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
										placeholder="SIREN"
										value={field.state.value ?? ""}
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
										placeholder="SIRET"
										value={field.state.value ?? ""}
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
										placeholder="Numéro de TVA"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</FormSection>

				{/* Section Notes */}
				<FormSection
					title="Notes"
					description="Informations supplémentaires"
					icon={Tag}
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
										placeholder="Notes sur le fournisseur"
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
										className="min-h-32"
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
				submitLabel="Mettre à jour le fournisseur"
				cancelHref={`/dashboard/${organizationId}/suppliers`}
			/>
		</form>
	);
}
