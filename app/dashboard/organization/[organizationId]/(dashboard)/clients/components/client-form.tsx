"use client";
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Mail, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useClientReference } from "../hooks/use-client-reference";
import {
	CIVILITY,
	CLIENT_LEGAL_FORMS,
	CLIENT_STATUS,
	CLIENT_TYPE,
} from "../lib/client-enums";
import ClientSchema from "../schemas/client-schema";
import createClient from "../server/create-client";
import editClient from "../server/edit-client";

type ClientFormProps = {
	initialValues?: z.infer<typeof ClientSchema>;
};

type FormValues = z.infer<typeof ClientSchema>;

export default function ClientForm({ initialValues }: ClientFormProps) {
	// States et hooks
	const [createState, createFormAction, isCreatePending] = useActionState(
		createClient,
		null
	);
	const [editState, editFormAction, isEditPending] = useActionState(
		editClient,
		null
	);

	const isPending = isCreatePending || isEditPending;
	const router = useRouter();
	const { organizationId, clientId } = useParams();
	const { generateClientReference, checkReference } = useClientReference();
	console.log(createState);
	console.log(editState);

	const form = useForm<FormValues>({
		resolver: zodResolver(ClientSchema),
		defaultValues: {
			id: (clientId as string) ?? undefined,
			organizationId: organizationId as string,
			clientType: initialValues?.clientType || "INDIVIDUAL",
			status: initialValues?.status || "LEAD",
			reference: initialValues?.reference || "",
			name: initialValues?.name || "",
			email: initialValues?.email || "",
			phone: initialValues?.phone || "",
			website: initialValues?.website || "",
			civility: initialValues?.civility || undefined,
			siren: initialValues?.siren || "",
			siret: initialValues?.siret || "",
			vatNumber: initialValues?.vatNumber || "",
			legalForm: initialValues?.legalForm || undefined,
		},
		mode: "onBlur",
	});

	const clientType = form.watch("clientType");

	// Soumission du formulaire
	async function onSubmit(data: FormValues) {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value.toString());
			}
		});

		startTransition(() => {
			if (initialValues) {
				editFormAction(formData);
			} else {
				createFormAction(formData);
			}
		});
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Bloc de gauche */}
					<div className="space-y-6">
						{/* Informations générales */}
						<div className="relative overflow-hidden rounded-lg border bg-card p-4">
							<div className="flex items-center gap-2 mb-4">
								<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
									<Building2 className="h-4 w-4 text-primary" />
								</div>
								<div>
									<h4 className="font-medium">Informations générales</h4>
									<p className="text-sm text-muted-foreground">
										Renseignez les informations essentielles du client
									</p>
								</div>
							</div>
							<div className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="clientType"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Sélectionnez un type" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(CLIENT_TYPE).map(([key, value]) => (
															<SelectItem key={key} value={key}>
																{value}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Statut</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Sélectionnez un statut" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(CLIENT_STATUS).map(
															([key, value]) => (
																<SelectItem key={key} value={key}>
																	{value}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="reference"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Référence</FormLabel>
												<FormControl>
													<div className="relative flex gap-2">
														<div className="relative flex-1">
															<Input
																placeholder="CLI001"
																{...field}
																onChange={(e) => {
																	field.onChange(e.target.value);
																	checkReference(e.target.value);
																}}
																className="font-mono"
															/>
														</div>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger asChild>
																	<Button
																		type="button"
																		variant="outline"
																		size="icon"
																		onClick={async () => {
																			const reference =
																				await generateClientReference();
																			if (reference) {
																				form.setValue("reference", reference, {
																					shouldValidate: true,
																					shouldDirty: true,
																					shouldTouch: true,
																				});
																			}
																		}}
																		className="flex-shrink-0"
																	>
																		<Wand2 className="h-4 w-4" />
																	</Button>
																</TooltipTrigger>
																<TooltipContent>
																	<p>Générer une référence</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nom</FormLabel>
												<FormControl>
													<Input placeholder="Nom du client" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{clientType === "INDIVIDUAL" && (
									<FormField
										control={form.control}
										name="civility"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Civilité</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value || undefined}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Sélectionnez une civilité" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.entries(CIVILITY).map(([key, value]) => (
															<SelectItem key={key} value={key}>
																{value}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>
					</div>

					{/* Bloc de droite */}
					<div className="space-y-6">
						{/* Informations de contact */}
						<div className="relative overflow-hidden rounded-lg border bg-card p-4">
							<div className="flex items-center gap-2 mb-4">
								<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
									<Mail className="h-4 w-4 text-primary" />
								</div>
								<div>
									<h4 className="font-medium">Informations de contact</h4>
									<p className="text-sm text-muted-foreground">
										Renseignez les coordonnées du client
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="email@exemple.com"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="phone"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Téléphone</FormLabel>
												<FormControl>
													<Input
														placeholder="+33 6 00 00 00 00"
														{...field}
														value={field.value || ""}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="website"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Site web</FormLabel>
											<FormControl>
												<Input
													placeholder="https://exemple.com"
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{clientType === "COMPANY" && (
							<div className="relative overflow-hidden rounded-lg border bg-card p-4">
								<div className="flex items-center gap-2 mb-4">
									<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
										<Building2 className="h-4 w-4 text-primary" />
									</div>
									<div>
										<h4 className="font-medium">Informations légales</h4>
										<p className="text-sm text-muted-foreground">
											Renseignez les informations légales de l&apos;entreprise
										</p>
									</div>
								</div>

								<div className="space-y-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="siren"
											render={({ field }) => (
												<FormItem>
													<FormLabel>SIREN</FormLabel>
													<FormControl>
														<Input
															placeholder="123456789"
															className="font-mono"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="siret"
											render={({ field }) => (
												<FormItem>
													<FormLabel>SIRET</FormLabel>
													<FormControl>
														<Input
															placeholder="12345678900000"
															className="font-mono"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="vatNumber"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Numéro de TVA</FormLabel>
													<FormControl>
														<Input
															placeholder="FR12345678900"
															className="font-mono"
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="legalForm"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Forme juridique</FormLabel>
													<Select
														onValueChange={field.onChange}
														value={field.value || undefined}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Sélectionnez une forme juridique" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Object.entries(CLIENT_LEGAL_FORMS).map(
																([key, value]) => (
																	<SelectItem key={key} value={key}>
																		{value}
																	</SelectItem>
																)
															)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer avec boutons */}
				<div className="border rounded-lg bg-card p-4">
					<div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
						<p className="text-sm text-muted-foreground order-2 sm:order-1">
							Les champs marqués d&apos;un{" "}
							<span className="text-destructive">*</span> sont obligatoires
						</p>
						<div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									router.push(`/dashboard/${organizationId}/clients`)
								}
								disabled={isPending}
								className="flex-1 sm:flex-none"
							>
								Annuler
							</Button>
							<Button
								type="submit"
								disabled={isPending}
								className="flex-1 sm:flex-none relative min-w-[120px]"
							>
								{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{isPending
									? "Enregistrement..."
									: initialValues
									? "Enregistrer"
									: "Créer le client"}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
