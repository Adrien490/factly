"use client";

import ServerActionResponse from "@/components/server-action-response";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ServerActionState, ServerActionStatus } from "@/types/server-action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Organization } from "@prisma/client";
import { Building2, Loader2, MapPin, Phone, Receipt } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import OrganizationFormSchema from "../schemas/organization-form-schema";
import createOrganization from "../server/create-organization";
import editOrganization from "../server/edit-organization";

interface OrganizationFormProps {
	organization?: Organization;
}

export default function OrganizationForm({
	organization,
}: OrganizationFormProps) {
	const [state, dispatch, isPending] = useActionState<
		ServerActionState<Organization, typeof OrganizationFormSchema>,
		FormData
	>(
		async (previousState, formData) => {
			try {
				if (organization) {
					return await editOrganization(previousState, formData);
				}
				return await createOrganization(previousState, formData);
			} catch (error) {
				console.error(error);
				return {
					status: ServerActionStatus.ERROR,
					message: "Une erreur est survenue",
				};
			}
		},
		{
			message: "",
			status: ServerActionStatus.INITIAL,
			data: organization,
		}
	);

	const [form, fields] = useForm({
		id: "organization-form",
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: OrganizationFormSchema });
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	});

	return (
		<>
			<ServerActionResponse state={state} />
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={dispatch}
				className="space-y-6"
			>
				<input type="hidden" name="id" value={state?.data?.id ?? ""} />
				<div className="space-y-6 grid grid-cols-1 gap-4 md:grid-cols-2">
					{/* Informations générales */}
					<Card className="border shadow-sm">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2">
								<Building2 className="h-5 w-5 text-primary" />
								<div>
									<CardTitle className="text-lg font-medium">
										Informations générales
									</CardTitle>
									<CardDescription>
										Renseignez les informations générales de l&apos;organisation
									</CardDescription>
								</div>
							</div>

							<div className="mt-6 space-y-4">
								<div className="space-y-0.5">
									<FormLabel>Logo</FormLabel>
								</div>

								<div className="space-y-0.5">
									<FormLabel htmlFor={fields.name.id}>
										Nom <span className="text-destructive">*</span>
									</FormLabel>

									<Input
										id={fields.name.id}
										name={fields.name.name}
										placeholder="Nom de l'organisation"
										aria-describedby={fields.name.descriptionId}
										aria-invalid={!fields.name.valid}
										defaultValue={organization ? state?.data?.name : ""}
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

								<div className="space-y-0.5">
									<FormLabel htmlFor="legalForm">Forme juridique</FormLabel>

									<Input
										id="legalForm"
										name="legalForm"
										placeholder="SAS, SARL, etc."
										defaultValue={
											organization ? state?.data?.legalForm ?? "" : ""
										}
									/>
								</div>

								<div className="space-y-0.5">
									<FormLabel htmlFor="capital">Capital social</FormLabel>

									<Input
										id="capital"
										name="capital"
										type="number"
										placeholder="Capital social"
										defaultValue={
											organization ? state?.data?.capital ?? "" : ""
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Informations fiscales */}
					<Card className="border shadow-sm">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2">
								<Receipt className="h-5 w-5 text-primary" />
								<div>
									<CardTitle className="text-lg font-medium">
										Informations fiscales
									</CardTitle>
									<CardDescription>
										Renseignez les informations fiscales de l&apos;organisation
									</CardDescription>
								</div>
							</div>

							<div className="mt-6 space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-0.5">
										<FormLabel htmlFor="siren">SIREN</FormLabel>

										<Input
											id="siren"
											name="siren"
											placeholder="123456789"
											defaultValue={
												organization ? state?.data?.siren ?? "" : ""
											}
										/>
									</div>

									<div className="space-y-0.5">
										<FormLabel htmlFor="siret">SIRET</FormLabel>

										<Input
											id="siret"
											name="siret"
											placeholder="12345678900000"
											defaultValue={
												organization ? state?.data?.siret ?? "" : ""
											}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-0.5">
										<FormLabel htmlFor="vatNumber">Numéro de TVA</FormLabel>

										<Input
											id="vatNumber"
											name="vatNumber"
											placeholder="FR12345678900"
											defaultValue={
												organization ? state?.data?.vatNumber ?? "" : ""
											}
										/>
									</div>

									<div className="space-y-0.5">
										<FormLabel htmlFor="rcsNumber">Numéro RCS</FormLabel>

										<Input
											id="rcsNumber"
											name="rcsNumber"
											placeholder="RCS PARIS B 123 456 789"
											defaultValue={
												organization ? state?.data?.rcsNumber ?? "" : ""
											}
										/>
									</div>
								</div>

								<div className="flex flex-row items-center justify-between rounded-lg border p-4">
									<div className="space-y-0.5">
										<FormLabel htmlFor="vatOptionDebits">
											TVA sur les débits
										</FormLabel>
										<FormDescription>
											Activez cette option si vous déclarez la TVA sur les
											débits plutôt que sur les encaissements
										</FormDescription>
									</div>

									<Switch
										id="vatOptionDebits"
										name="vatOptionDebits"
										defaultChecked={
											organization
												? state?.data?.vatOptionDebits ?? false
												: false
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Contact */}
					<Card className="border shadow-sm">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2">
								<Phone className="h-5 w-5 text-primary" />
								<div>
									<CardTitle className="text-lg font-medium">Contact</CardTitle>
									<CardDescription>
										Renseignez les informations de contact de
										l&apos;organisation
									</CardDescription>
								</div>
							</div>

							<div className="mt-6 space-y-4">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-0.5">
										<FormLabel htmlFor="email">Email</FormLabel>

										<Input
											id="email"
											name="email"
											type="email"
											placeholder="contact@exemple.com"
											defaultValue={
												organization ? state?.data?.email ?? "" : ""
											}
										/>
									</div>

									<div className="space-y-0.5">
										<FormLabel htmlFor="phone">Téléphone</FormLabel>

										<Input
											id="phone"
											name="phone"
											placeholder="+33 1 23 45 67 89"
											defaultValue={
												organization ? state?.data?.phone ?? "" : ""
											}
										/>
									</div>
								</div>

								<div className="space-y-0.5">
									<FormLabel htmlFor="website">Site web</FormLabel>

									<Input
										id="website"
										name="website"
										type="url"
										placeholder="https://..."
										defaultValue={
											organization ? state?.data?.website ?? "" : ""
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Adresse */}
					<Card className="border shadow-sm">
						<CardContent className="pt-6">
							<div className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-primary" />
								<div>
									<CardTitle className="text-lg font-medium">Adresse</CardTitle>
									<CardDescription>
										Indiquez l&apos;adresse de l&apos;organisation
									</CardDescription>
								</div>
							</div>

							<div className="mt-6 space-y-4">
								<div className="space-y-0.5">
									<FormLabel htmlFor="address">Adresse</FormLabel>

									<Input
										id="address"
										name="address"
										placeholder="123 rue exemple"
										defaultValue={
											organization ? state?.data?.address ?? "" : ""
										}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-0.5">
										<FormLabel htmlFor="zipCode">Code postal</FormLabel>

										<Input
											id="zipCode"
											name="zipCode"
											placeholder="75000"
											defaultValue={
												organization ? state?.data?.zipCode ?? "" : ""
											}
										/>
									</div>

									<div className="space-y-0.5">
										<FormLabel htmlFor="city">Ville</FormLabel>

										<Input
											id="city"
											name="city"
											placeholder="Paris"
											defaultValue={organization ? state?.data?.city ?? "" : ""}
										/>
									</div>
								</div>

								<div className="space-y-0.5">
									<FormLabel htmlFor="country">Pays</FormLabel>

									<Input
										id="country"
										name="country"
										placeholder="France"
										defaultValue={
											organization ? state?.data?.country ?? "" : ""
										}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<Card className="sticky bottom-0 border shadow-sm">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
							<p className="text-sm text-muted-foreground order-2 sm:order-1">
								Les champs marqués d&apos;un{" "}
								<span className="text-destructive">*</span> sont obligatoires
							</p>

							<div className="flex gap-4 w-full sm:w-auto order-1 sm:order-2">
								<Link href="/dashboard/organizations">
									<Button type="button" variant="outline" disabled={isPending}>
										Annuler
									</Button>
								</Link>

								<Button type="submit" disabled={isPending}>
									{isPending && (
										<Loader2
											className="mr-2 h-4 w-4 animate-spin"
											aria-hidden="true"
										/>
									)}
									{organization ? "Enregistrer" : "Créer"}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</>
	);
}
