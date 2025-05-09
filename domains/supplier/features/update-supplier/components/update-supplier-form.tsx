"use client";

import {
	FormErrors,
	FormFooter,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";

import {
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { GetSupplierReturn } from "@/domains/supplier/features/get-supplier";
import { ContentCard } from "@/shared/components/content-card";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import { useUpdateSupplier } from "../hooks/use-update-supplier";

type Props = {
	supplier: NonNullable<GetSupplierReturn>;
};

export function UpdateSupplierForm({ supplier }: Props) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateSupplier();

	// TanStack Form setup
	const form = useAppForm({
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
			<form.AppField name="id">
				{(field) => (
					<input type="hidden" name="id" value={field.state.value ?? ""} />
				)}
			</form.AppField>

			<FormLayout withDividers columns={2}>
				{/* Section Information de base */}
				<ContentCard
					title="Informations de base"
					description="Informations générales sur le fournisseur"
				>
					<div className="space-y-4">
						<form.AppField
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Nom"
									disabled={isPending}
									placeholder="Nom"
								/>
							)}
						</form.AppField>

						<form.AppField name="legalName">
							{(field) => (
								<field.InputField
									label="Raison sociale"
									disabled={isPending}
									placeholder="Raison sociale"
								/>
							)}
						</form.AppField>

						<form.AppField
							name="supplierType"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le type de fournisseur est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									options={SUPPLIER_TYPES.map((type) => ({
										label: type.label,
										value: type.value,
									}))}
									label="Type de fournisseur"
									disabled={isPending}
									placeholder="Sélectionnez un type de fournisseur"
								/>
							)}
						</form.AppField>

						<form.AppField name="status">
							{(field) => (
								<field.SelectField
									options={SUPPLIER_STATUSES.map((status) => ({
										label: status.label,
										value: status.value,
									}))}
									label="Statut"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				{/* Section Coordonnées */}
				<ContentCard
					title="Coordonnées"
					description="Informations de contact du fournisseur"
				>
					<div className="space-y-4">
						<form.AppField name="email">
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

						<form.AppField name="website">
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

				{/* Section Informations fiscales */}
				<ContentCard
					title="Informations fiscales"
					description="Informations légales et fiscales"
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

				{/* Section Notes */}
				<ContentCard title="Notes" description="Informations supplémentaires">
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
				submitLabel="Mettre à jour le fournisseur"
				cancelHref={`/dashboard/${organizationId}/suppliers`}
			/>
		</form>
	);
}
