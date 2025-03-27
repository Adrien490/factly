"use client";

import { Button } from "@/features/shared/components/ui/button";
import { FormLabel } from "@/features/shared/components/ui/form";
import { Input } from "@/features/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/features/shared/components/ui/select";
import { Textarea } from "@/features/shared/components/ui/textarea";

import { FormErrors } from "@/features/shared/components/forms/components/form-errors";
import { FormFooter } from "@/features/shared/components/forms/components/form-footer";
import { FormLayout } from "@/features/shared/components/forms/components/form-layout";
import { FormSection } from "@/features/shared/components/forms/components/form-section";

import { useCreateFiscalYear } from "@/features/fiscal-year/create";
import { FISCAL_YEAR_STATUS_OPTIONS } from "@/features/fiscal-year/fiscal-year-status-options";
import { FieldInfo } from "@/features/shared/components/forms/components/field-info";
import { Calendar } from "@/features/shared/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/features/shared/components/ui/popover";
import { useToast } from "@/features/shared/hooks/use-toast";
import { cn } from "@/features/shared/lib/utils";
import { ServerActionStatus } from "@/features/shared/types/server-action";
import {
	mergeForm,
	Updater,
	useForm,
	useTransform,
} from "@tanstack/react-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FiscalYearFormProps {
	organizationId: string;
}

export function CreateFiscalYearForm({ organizationId }: FiscalYearFormProps) {
	const { state, dispatch, isPending } = useCreateFiscalYear();
	const router = useRouter();
	const { toast } = useToast();

	// TanStack Form setup
	const form = useForm({
		defaultValues: {
			organizationId,
			name: "",
			startDate: undefined as Date | undefined,
			endDate: undefined as Date | undefined,
			status: undefined as string | undefined,
			notes: "",
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
				title: "Année fiscale créée",
				description: state?.message,
			});

			setTimeout(() => {
				router.push(`/dashboard`);
			}, 500);
		}
	}, [isPending, state, toast, router]);

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
			<form.Field name="organizationId">
				{(field) => (
					<input
						type="hidden"
						name="organizationId"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>

			<FormLayout columns={1} className="mt-6">
				{/* Section 1: Informations de base */}
				<FormSection
					title="Informations de l'année fiscale"
					description="Renseignez les informations principales de l'année fiscale"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le nom est requis";
									if (value.length < 2) return "Le nom est trop court";
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
										name="name"
										placeholder="Ex: Exercice 2023-2024"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<div className="grid grid-cols-2 gap-4">
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
										<FormLabel
											htmlFor="startDate"
											className="flex items-center"
										>
											Date de début
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id="startDate"
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.state.value ? (
														format(field.state.value, "PP", { locale: fr })
													) : (
														<span>Sélectionner une date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													locale={fr}
													selected={field.state.value}
													onSelect={(date) => field.handleChange(date)}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<input
											type="hidden"
											name="startDate"
											value={
												field.state.value
													? format(field.state.value, "yyyy-MM-dd")
													: ""
											}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>

							<form.Field
								name="endDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) return "La date de fin est requise";
										const startDate = form.getFieldValue("startDate");
										if (startDate && value <= startDate) {
											return "La date de fin doit être postérieure à la date de début";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<div className="space-y-1.5">
										<FormLabel htmlFor="endDate" className="flex items-center">
											Date de fin
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													id="endDate"
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal",
														!field.state.value && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.state.value ? (
														format(field.state.value, "PP", { locale: fr })
													) : (
														<span>Sélectionner une date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													locale={fr}
													selected={field.state.value}
													onSelect={(date) => field.handleChange(date)}
													initialFocus
													disabled={(date) => {
														const startDate = form.getFieldValue("startDate");
														if (!startDate) return false;
														return date < startDate;
													}}
												/>
											</PopoverContent>
										</Popover>
										<input
											type="hidden"
											name="endDate"
											value={
												field.state.value
													? format(field.state.value, "yyyy-MM-dd")
													: ""
											}
										/>
										<FieldInfo field={field} />
									</div>
								)}
							</form.Field>
						</div>

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
									<FormLabel htmlFor="status" className="flex items-center">
										Statut
										<span className="text-destructive ml-1">*</span>
									</FormLabel>
									<Select
										name="status"
										onValueChange={(value) => {
											field.handleChange(value as Updater<string | undefined>);
										}}
										value={field.state.value}
									>
										<SelectTrigger
											id="status"
											className="border-input focus:ring-1 focus:ring-primary"
										>
											<SelectValue placeholder="Sélectionnez un statut" />
										</SelectTrigger>
										<SelectContent>
											{FISCAL_YEAR_STATUS_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													<div className="flex items-center gap-2">
														<div
															className="w-2 h-2 rounded-full"
															style={{ backgroundColor: option.color }}
														/>
														{option.label}
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</div>
							)}
						</form.Field>

						<form.Field name="notes">
							{(field) => (
								<div className="space-y-1.5">
									<FormLabel htmlFor="notes" className="flex items-center">
										Notes
									</FormLabel>
									<Textarea
										id="notes"
										name="notes"
										placeholder="Notes ou informations complémentaires"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										className="border-input focus:ring-1 focus:ring-primary"
										rows={4}
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
						cancelHref="/dashboard/fiscal-years"
						submitLabel={"Créer l'année fiscale"}
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
