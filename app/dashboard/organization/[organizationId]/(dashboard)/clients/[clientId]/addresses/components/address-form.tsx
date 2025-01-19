"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@radix-ui/react-checkbox";
import AddressSchema from "../schemas/address-schema";
import createAddress from "../server/create-address";
import editAddress from "../server/edit-address";

type AddressFormProps = {
	initialValues?: z.infer<typeof AddressSchema>;
};

type FormValues = z.infer<typeof AddressSchema>;

export default function AddressForm({ initialValues }: AddressFormProps) {
	// States et hooks
	const [createState, createFormAction] = useActionState(createAddress, null);
	const [editState, editFormAction] = useActionState(editAddress, null);
	const [isPending, startTransition] = useTransition();
	console.log(createState);
	console.log(editState);
	const router = useRouter();
	const { organizationId, clientId } = useParams();

	const form = useForm<FormValues>({
		resolver: zodResolver(AddressSchema),
		defaultValues: {
			addressType: initialValues?.addressType || "BILLING",
			line1: initialValues?.line1 || "",
			line2: initialValues?.line2 || "",
			zipCode: initialValues?.zipCode || "",
			city: initialValues?.city || "",
			country: initialValues?.country || "FR",
			isDefault: initialValues?.isDefault ?? true,
		},
		mode: "onBlur",
	});

	// Soumission du formulaire
	async function onSubmit(data: FormValues) {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value.toString());
			}
		});
		// Ajouter l'ID du client
		formData.append("clientId", clientId as string);

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
				<div className="space-y-6">
					{/* Informations de l'adresse */}
					<div className="relative overflow-hidden rounded-lg border bg-card p-4">
						<div className="flex items-center gap-2 mb-4">
							<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
								<MapPin className="h-4 w-4 text-primary" />
							</div>
							<div>
								<h4 className="font-medium">Informations de l&apos;adresse</h4>
								<p className="text-sm text-muted-foreground">
									Renseignez les détails de l&apos;adresse
								</p>
							</div>
						</div>

						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="addressType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type d&apos;adresse</FormLabel>
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
													<SelectItem value="BILLING">Facturation</SelectItem>
													<SelectItem value="SHIPPING">Livraison</SelectItem>
													<SelectItem value="OTHER">Autre</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="isDefault"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>Adresse par défaut</FormLabel>
												<FormDescription>
													Cette adresse sera utilisée par défaut
												</FormDescription>
											</div>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="line1"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Adresse</FormLabel>
										<FormControl>
											<Input placeholder="123 rue Example" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="line2"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Complément d&apos;adresse</FormLabel>
										<FormControl>
											<Input
												placeholder="Bâtiment A, Étage 3..."
												{...field}
												value={field.value || ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="zipCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Code postal</FormLabel>
											<FormControl>
												<Input placeholder="75001" {...field} />
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
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Sélectionnez un pays" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="FR">France</SelectItem>
												<SelectItem value="BE">Belgique</SelectItem>
												<SelectItem value="CH">Suisse</SelectItem>
												<SelectItem value="LU">Luxembourg</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
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
									router.push(
										`/dashboard/${organizationId}/clients/${clientId}/addresses`
									)
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
									: "Créer l'adresse"}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
