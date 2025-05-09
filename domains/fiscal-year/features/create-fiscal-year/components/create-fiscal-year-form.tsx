"use client";

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
import { cn, createToastCallbacks, withCallbacks } from "@/shared/utils";
import { FiscalYear } from "@prisma/client";
import { mergeForm, useForm, useTransform } from "@tanstack/react-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { createFiscalYear } from "../actions";
import { createFiscalYearSchema } from "../schemas";

export function CreateFiscalYearForm() {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createFiscalYear,
			createToastCallbacks<FiscalYear, typeof createFiscalYearSchema>({
				loadingMessage: "Création de l'année fiscale en cours...",
				onSuccess: (result) => {
					toast.success("Année fiscale créée avec succès", {
						description: `L'année fiscale "${
							result.data?.name || ""
						}" a été ajouté à votre organisation.`,
						duration: 5000,
						action: {
							label: "Voir l'année fiscale",
							onClick: () => {
								if (result.data?.id) {
									router.push(
										`/dashboard/${result.data.organizationId}/fiscal-years/${result.data.id}`
									);
								}
							},
						},
					});
					form.reset();
				},
			})
		),
		undefined
	);

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			organizationId,
			name: `Année fiscale ${new Date().getFullYear()}`,
			description: "",
			startDate: new Date(new Date().getFullYear(), 0, 1), // 1er janvier de l'année courante
			endDate: new Date(new Date().getFullYear(), 11, 31), // 31 décembre de l'année courante
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

			<FormLayout withDividers columns={2} className="mt-6">
				{/* Section 1: Informations de base */}
				<ContentCard
					title="Informations générales"
					description="Renseignez les informations principales de l'année fiscale"
					icon={CalendarIcon}
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
					description="Définissez les dates de début et de fin de l'année fiscale"
					icon={Clock}
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

						{/* Note informative sur le statut */}
						<div className="pt-2">
							<p className="text-xs text-muted-foreground">
								<span className="font-medium">Note:</span> Le statut initial
								d&apos;une année fiscale est automatiquement défini à
								&quot;Active&quot;. Pour modifier le statut d&apos;une année
								fiscale existante, utilisez les options dédiées depuis la vue
								détail de l&apos;année fiscale.
							</p>
						</div>
					</div>
				</ContentCard>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending}
						cancelHref={`/dashboard/${organizationId}/fiscal-years`}
						submitLabel="Créer l'année fiscale"
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
