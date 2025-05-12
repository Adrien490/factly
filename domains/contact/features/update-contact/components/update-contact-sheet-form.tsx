"use client";

import { CIVILITY_OPTIONS } from "@/domains/contact/constants/civility-options";
import { FormErrors, useAppForm } from "@/shared/components/forms";
import {
	Button,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { Contact } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useParams } from "next/navigation";
import { ReactNode, useActionState, useState } from "react";
import { toast } from "sonner";
import { GetContactReturn } from "../../get-contact";
import { updateContact } from "../actions/update-contact";
import { updateContactSchema } from "../schemas/update-contact-schema";

interface UpdateContactSheetFormProps {
	contact: NonNullable<GetContactReturn>;
	children?: ReactNode;
}

export function UpdateContactSheetForm({
	contact,
	children,
}: UpdateContactSheetFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const clientId = contact.clientId;
	const supplierId = contact.supplierId;

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			updateContact,
			createToastCallbacks<Contact, typeof updateContactSchema>({
				loadingMessage: "Mise à jour du contact en cours...",
				onSuccess: (data) => {
					form.reset();
					setIsOpen(false);
					toast.success("Contact mis à jour avec succès", {
						description: `Le contact "${data.data?.firstName} ${data.data?.lastName}" a été mis à jour.`,
						duration: 5000,
					});
				},
			})
		),
		undefined
	);

	// TanStack Form setup avec les valeurs par défaut
	const form = useAppForm({
		defaultValues: {
			id: contact.id,
			organizationId,
			clientId,
			supplierId,
			firstName: contact.firstName,
			lastName: contact.lastName,
			civility: contact.civility,
			function: contact.function || "",
			email: contact.email || "",
			phoneNumber: contact.phoneNumber || "",
			mobileNumber: contact.mobileNumber || "",
			faxNumber: contact.faxNumber || "",
			website: contact.website || "",
			isDefault: contact.isDefault,
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{children || <Button className="shrink-0">Modifier le contact</Button>}
			</SheetTrigger>

			<SheetContent>
				<form
					action={dispatch}
					className="flex flex-col h-full"
					onSubmit={() => form.handleSubmit()}
				>
					<SheetHeader className="mb-5">
						<SheetTitle>Modifier le contact</SheetTitle>
					</SheetHeader>

					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Champs cachés */}
					<form.AppField name="id">
						{(field) => (
							<input type="hidden" name="id" value={field.state.value} />
						)}
					</form.AppField>
					<form.AppField name="organizationId">
						{(field) => (
							<input
								type="hidden"
								name="organizationId"
								value={field.state.value}
							/>
						)}
					</form.AppField>
					{clientId && (
						<form.AppField name="clientId">
							{() => <input type="hidden" name="clientId" value={clientId} />}
						</form.AppField>
					)}
					{supplierId && (
						<form.AppField name="supplierId">
							{() => (
								<input type="hidden" name="supplierId" value={supplierId} />
							)}
						</form.AppField>
					)}

					{/* Contenu du formulaire avec défilement */}
					<div className="flex-1 overflow-y-auto pr-1 space-y-6">
						{/* Informations de base */}
						<div className="space-y-4 mx-auto w-full">
							{/* Civilité */}
							<form.AppField name="civility">
								{(field) => (
									<field.SelectField
										label="Civilité"
										options={CIVILITY_OPTIONS}
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Nom */}
							<form.AppField
								name="lastName"
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
										placeholder="Nom du contact"
										required
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Prénom */}
							<form.AppField name="firstName">
								{(field) => (
									<field.InputField
										label="Prénom"
										placeholder="Prénom du contact"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Fonction */}
							<form.AppField name="function">
								{(field) => (
									<field.InputField
										label="Fonction"
										placeholder="Fonction du contact"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Email */}
							<form.AppField
								name="email"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
											return "L'email n'est pas valide";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Email"
										placeholder="email@exemple.com"
										type="email"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Téléphone fixe */}
							<form.AppField
								name="phoneNumber"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\+?[0-9\s-]{10,}$/.test(value)) {
											return "Le numéro de téléphone n'est pas valide";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Téléphone fixe"
										placeholder="+33 1 23 45 67 89"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Téléphone mobile */}
							<form.AppField
								name="mobileNumber"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\+?[0-9\s-]{10,}$/.test(value)) {
											return "Le numéro de mobile n'est pas valide";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Téléphone mobile"
										placeholder="+33 6 12 34 56 78"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Fax */}
							<form.AppField
								name="faxNumber"
								validators={{
									onChange: ({ value }) => {
										if (value && !/^\+?[0-9\s-]{10,}$/.test(value)) {
											return "Le numéro de fax n'est pas valide";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Fax"
										placeholder="+33 1 23 45 67 89"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Site web */}
							<form.AppField
								name="website"
								validators={{
									onChange: ({ value }) => {
										if (
											value &&
											!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value)
										) {
											return "L'URL du site web n'est pas valide";
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.InputField
										label="Site web"
										placeholder="https://www.exemple.com"
										type="url"
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Contact par défaut */}
							<form.AppField name="isDefault">
								{(field) => (
									<field.CheckboxField
										label="Contact par défaut"
										disabled={isPending}
									/>
								)}
							</form.AppField>
						</div>
					</div>

					{/* Footer avec bouton de soumission */}
					<SheetFooter className="mt-6 flex-shrink-0 px-0 w-full">
						<form.Subscribe selector={(state) => state.canSubmit}>
							{(canSubmit) => (
								<Button
									type="submit"
									className="w-full"
									disabled={!canSubmit || isPending}
								>
									{isPending
										? "Mise à jour en cours..."
										: "Mettre à jour le contact"}
								</Button>
							)}
						</form.Subscribe>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
