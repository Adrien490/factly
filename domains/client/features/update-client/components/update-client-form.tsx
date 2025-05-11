"use client";

import { CLIENT_STATUSES } from "@/domains/client/constants/client-statuses";
import { CLIENT_TYPES } from "@/domains/client/constants/client-types";
import { GetClientReturn } from "@/domains/client/features/get-client";
import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormLayout,
	useAppForm,
} from "@/shared/components/forms";
import { FormFooter } from "@/shared/components/forms/form-footer";
import { Button, FormLabel, Input } from "@/shared/components/ui";
import { generateReference } from "@/shared/utils";
import { ClientStatus } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { Wand2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useUpdateClient } from "../hooks/use-update-client";

type Props = {
	client: NonNullable<GetClientReturn>;
};

export function UpdateClientForm({ client }: Props) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { state, dispatch, isPending } = useUpdateClient();

	const form = useAppForm({
		defaultValues: {
			organizationId,
			id: client.id,
			reference: state?.inputs?.reference ?? client.reference,
			clientType: state?.inputs?.clientType ?? client.clientType,
			status: state?.inputs?.status ?? client.status,
			notes: state?.inputs?.notes ?? client.notes,
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	const handleGenerateReference = async () => {
		try {
			const reference = await generateReference({
				prefix: "CLI",
				format: "alphanumeric",
				length: 2,
				separator: "-",
			});

			form.setFieldValue("reference", reference);
			form.validateField("reference", "change");
		} catch (error) {
			console.error("Erreur lors de la génération de référence", error);
		}
	};

	return (
		<form
			action={dispatch}
			className="space-y-6"
			onSubmit={() => form.handleSubmit()}
		>
			<form.Subscribe selector={(state) => state.errors}>
				{(errors) => <FormErrors errors={errors} />}
			</form.Subscribe>

			<input type="hidden" name="organizationId" value={organizationId} />
			<input type="hidden" name="id" value={client.id} />

			<FormLayout withDividers columns={2} className="mt-6">
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations générales du client"
				>
					<div className="space-y-4">
						<form.AppField name="clientType">
							{(field) => (
								<div className="flex flex-col gap-3">
									<input
										type="hidden"
										name="clientType"
										value={field.state.value}
									/>
									<field.RadioGroupField
										disabled={isPending}
										label="Type de client"
										options={CLIENT_TYPES}
									/>
								</div>
							)}
						</form.AppField>

						<form.Field
							name="reference"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La référence est requise";
									if (value.length < 3)
										return "La référence doit comporter au moins 3 caractères";
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
											disabled={isPending}
											size="sm"
											onClick={handleGenerateReference}
											title="Générer une référence unique"
											className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
										>
											<Wand2 className="h-3 w-3 mr-1" />
											Générer
										</Button>
									</div>

									<div className="relative">
										<Input
											id="reference"
											disabled={isPending}
											name="reference"
											placeholder="Référence unique (ex: CLI-001)"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</div>

									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.AppField name="notes">
							{(field) => (
								<field.TextareaField
									disabled={isPending}
									label="Notes"
									rows={6}
									placeholder="Notes et informations complémentaires"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>

				<ContentCard
					title="Classification"
					description="Catégorisation et statut du client"
				>
					<div className="space-y-4">
						<form.AppField
							name="status"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le statut est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Statut"
									disabled={isPending}
									options={CLIENT_STATUSES.filter(
										(status) => status.value !== ClientStatus.ARCHIVED
									).map((status) => ({
										value: status.value,
										label: status.label,
									}))}
									placeholder="Sélectionnez un statut"
								/>
							)}
						</form.AppField>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						submitLabel="Modifier le client"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
