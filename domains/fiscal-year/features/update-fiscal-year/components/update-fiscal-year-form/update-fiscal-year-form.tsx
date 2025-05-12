"use client";

import { ContentCard } from "@/shared/components/content-card";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
} from "@/shared/components/forms";
import {
	Button,
	Calendar,
	FormLabel,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Textarea,
} from "@/shared/components/ui";
import { cn } from "@/shared/utils";
import { FiscalYear } from "@prisma/client";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useUpdateFiscalYear } from "../../hooks/use-update-fiscal-year";

export interface UpdateFiscalYearFormProps {
	fiscalYear: FiscalYear;
}

export function UpdateFiscalYearForm({
	fiscalYear,
}: UpdateFiscalYearFormProps) {
	const params = useParams();
	const organizationId = params.organizationId as string;

	const { state, dispatch, isPending } = useUpdateFiscalYear();

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			id: fiscalYear.id,
			organizationId: fiscalYear.organizationId,
			name: state?.inputs?.name ?? fiscalYear.name,
			description: state?.inputs?.description ?? (fiscalYear.description || ""),
			startDate: state?.inputs?.startDate ?? fiscalYear.startDate,
			endDate: state?.inputs?.endDate ?? fiscalYear.endDate,
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
			<input type="hidden" name="id" value={fiscalYear.id} />
			{/* Conservation du statut actuel, le changement de statut se fait via une action dédiée */}
			<input type="hidden" name="status" value={fiscalYear.status} />

			<form.Field name="startDate">
				{(field) => (
					<input
						type="hidden"
						name="startDate"
						value={
							field.state.value instanceof Date
								? field.state.value.toISOString()
								: ""
						}
					/>
				)}
			</form.Field>

			<form.Field name="endDate">
				{(field) => (
					<input
						type="hidden"
						name="endDate"
						value={
							field.state.value instanceof Date
								? field.state.value.toISOString()
								: ""
						}
					/>
				)}
			</form.Field>

			<FormLayout withDividers columns={2}>
				{/* Section 1: Informations de base */}
				<ContentCard
					title="Informations générales"
					description="Modifiez les informations principales de l'année fiscale"
				>
					<div className="space-y-4">
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value)
										return "Le nom de l&apos;année fiscale est requis";
									if (value.length < 1) return "Le nom est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="name" className="flex items-center">
										Nom de l&apos;année fiscale
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Input
										id="name"
										disabled={isPending}
										name="name"
										placeholder="Année fiscale 2024"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<p className="text-xs text-muted-foreground">
										Nom permettant d&apos;identifier facilement l&apos;année
										fiscale
									</p>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="description">
										Description (optionnelle)
									</FormLabel>
									<Textarea
										id="description"
										disabled={isPending}
										name="description"
										placeholder="Informations supplémentaires sur cette année fiscale"
										className="min-h-[100px]"
										value={field.state.value || ""}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>
					</div>
				</ContentCard>

				{/* Section 2: Dates */}
				<ContentCard
					title="Période de l'année fiscale"
					description="Modifiez les dates de début et de fin de l'année fiscale"
				>
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<form.Field
								name="startDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "La date de début est requise";
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="startDate">
											Date de début
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id="startDate-trigger"
													variant={"outline"}
													disabled={isPending}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground"
													)}
												>
													{field.state.value ? (
														format(new Date(field.state.value), "dd/MM/yyyy", {
															locale: fr,
														})
													) : (
														<span>Sélectionner une date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={
														field.state.value
															? new Date(field.state.value)
															: undefined
													}
													onSelect={(date) => {
														if (date) {
															field.handleChange(date);
														}
													}}
													initialFocus
													locale={fr}
													fromYear={2000}
													toYear={2050}
												/>
											</PopoverContent>
										</Popover>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.Field
								name="endDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "La date de fin est requise";
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="endDate">
											Date de fin
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id="endDate-trigger"
													variant={"outline"}
													disabled={isPending}
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground"
													)}
												>
													{field.state.value ? (
														format(new Date(field.state.value), "dd/MM/yyyy", {
															locale: fr,
														})
													) : (
														<span>Sélectionner une date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={
														field.state.value
															? new Date(field.state.value)
															: undefined
													}
													onSelect={(date) => {
														if (date) {
															field.handleChange(date);
														}
													}}
													initialFocus
													locale={fr}
													fromYear={2000}
													toYear={2050}
												/>
											</PopoverContent>
										</Popover>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
						</div>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						cancelHref={`/dashboard/${organizationId}/fiscal-years/${fiscalYear.id}`}
						submitLabel="Mettre à jour l'année fiscale"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
