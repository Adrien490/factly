"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, MapPin, Phone, Receipt } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OrganizationFormSchema from "../schemas/organization-form-schema";

type OrganizationFormValues = z.infer<typeof OrganizationFormSchema>;

interface OrganizationFormProps {
	initialValues?: OrganizationFormValues;
}

export default function OrganizationForm({
	initialValues,
}: OrganizationFormProps) {
	const router = useRouter();

	const { organizationId } = useParams<{
		organizationId: string;
	}>();

	const [isPending, startTransition] = useTransition();

	const form = useForm<OrganizationFormValues>({
		resolver: zodResolver(OrganizationFormSchema),
		defaultValues: {
			id: organizationId ?? undefined,
			name: initialValues?.name ?? "",
			siren: initialValues?.siren ?? "",
			siret: initialValues?.siret ?? "",
			vatNumber: initialValues?.vatNumber ?? "",
			vatOptionDebits: initialValues?.vatOptionDebits ?? false,
			legalForm: initialValues?.legalForm ?? "",
			rcsNumber: initialValues?.rcsNumber ?? "",
			capital: initialValues?.capital ?? null,
			address: initialValues?.address ?? "",
			city: initialValues?.city ?? "",
			zipCode: initialValues?.zipCode ?? "",
			country: initialValues?.country ?? "",
			phone: initialValues?.phone ?? "",
			email: initialValues?.email ?? "",
			website: initialValues?.website ?? "",
		},
		mode: "onBlur",
	});

	async function onSubmit(data: OrganizationFormValues) {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined) {
				if (typeof value === "boolean") {
					formData.append(key, value ? "true" : "false");
				} else if (typeof value === "number") {
					formData.append(key, String(value));
				} else {
					formData.append(key, String(value));
				}
			}
		});

		if (organizationId) {
			formData.append("id", organizationId);
		}

		startTransition(() => {
			if (initialValues) {
				// editFormAction(formData);
			} else {
				// createFormAction(formData);
			}
		});
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Informations générales */}
						<Card className="border shadow-sm">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5 text-primary" />
									<div>
										<CardTitle className="text-lg font-medium">
											Informations générales
										</CardTitle>
										<CardDescription>
											Saisissez les informations principales de
											l&apos;organisation
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Nom <span className="text-destructive">*</span>
											</FormLabel>
											<FormControl>
												<Input placeholder="Nom de l'organisation" {...field} />
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
											<FormControl>
												<Input placeholder="SAS, SARL, etc." {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="capital"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Capital social</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Capital social"
													value={field.value ?? ""}
													onChange={(e) =>
														field.onChange(
															e.target.value ? Number(e.target.value) : null
														)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Informations fiscales */}
						<Card className="border shadow-sm">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Receipt className="h-5 w-5 text-primary" />
									<div>
										<CardTitle className="text-lg font-medium">
											Informations fiscales
										</CardTitle>
										<CardDescription>
											Renseignez les informations fiscales de
											l&apos;organisation
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="siren"
										render={({ field }) => (
											<FormItem>
												<FormLabel>SIREN</FormLabel>
												<FormControl>
													<Input placeholder="123456789" {...field} />
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
													<Input placeholder="12345678900000" {...field} />
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
													<Input placeholder="FR12345678900" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="rcsNumber"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Numéro RCS</FormLabel>
												<FormControl>
													<Input
														placeholder="RCS Paris B 123456789"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="vatOptionDebits"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													TVA sur les débits
												</FormLabel>
												<FormDescription>
													Activez cette option si vous déclarez la TVA sur les
													débits plutôt que sur les encaissements
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Contact */}
						<Card className="border shadow-sm">
							<CardHeader>
								<div className="flex items-center gap-2">
									<Phone className="h-5 w-5 text-primary" />
									<div>
										<CardTitle className="text-lg font-medium">
											Contact
										</CardTitle>
										<CardDescription>
											Renseignez les informations de contact de
											l&apos;organisation
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
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
														placeholder="contact@exemple.com"
														{...field}
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
													<Input placeholder="+33 1 23 45 67 89" {...field} />
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
													type="url"
													placeholder="https://..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>

						{/* Adresse */}
						<Card className="border shadow-sm">
							<CardHeader>
								<div className="flex items-center gap-2">
									<MapPin className="h-5 w-5 text-primary" />
									<div>
										<CardTitle className="text-lg font-medium">
											Adresse
										</CardTitle>
										<CardDescription>
											Indiquez l&apos;adresse de l&apos;organisation
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Adresse</FormLabel>
											<FormControl>
												<Input placeholder="123 rue exemple" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="zipCode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Code postal</FormLabel>
												<FormControl>
													<Input placeholder="75000" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="city"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Ville</FormLabel>
												<FormControl>
													<Input placeholder="Paris" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Pays</FormLabel>
											<FormControl>
												<Input placeholder="France" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
						</Card>
					</div>

					<Card className="border shadow-sm">
						<CardContent className="pt-6">
							<div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
								<p className="text-sm text-muted-foreground order-2 sm:order-1">
									Les champs marqués d&apos;un{" "}
									<span className="text-destructive">*</span> sont obligatoires
								</p>
								<div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.push("/organizations")}
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
										{isPending && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										{isPending
											? "Enregistrement..."
											: initialValues
											? "Enregistrer"
											: "Créer l'organisation"}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</form>
			</Form>
		</>
	);
}
