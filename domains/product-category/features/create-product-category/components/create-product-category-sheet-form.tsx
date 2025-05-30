"use client";

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
import { ProductCategory } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { ReactNode, useActionState, useState } from "react";
import { toast } from "sonner";
import { GetProductCategoryReturn } from "../../get-product-category";
import { createProductCategory } from "../actions/create-product-category";
import { createProductCategorySchema } from "../schemas";

interface CreateProductCategorySheetFormProps {
	children?: ReactNode;
	currentCategory?: GetProductCategoryReturn;
}

export function CreateProductCategorySheetForm({
	currentCategory,
	children,
}: CreateProductCategorySheetFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const [state, dispatch, isPending] = useActionState(
		withCallbacks(
			createProductCategory,
			createToastCallbacks<ProductCategory, typeof createProductCategorySchema>(
				{
					loadingMessage: "Création de la catégorie en cours...",
					onSuccess: (data) => {
						form.reset();
						setIsOpen(false);
						toast.success("Catégorie créée avec succès", {
							description: `La catégorie "${
								data.data?.name || ""
							}" a été ajoutée.`,
							duration: 5000,
							action: {
								label: "Voir la catégorie",
								onClick: () => {
									if (data.data?.id) {
										router.push(
											`/dashboard/products/categories/${data.data.id}`
										);
									}
								},
							},
						});
					},
				}
			)
		),
		undefined
	);

	// TanStack Form setup avec les valeurs par défaut
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				{children || <Button className="shrink-0">Nouvelle catégorie</Button>}
			</SheetTrigger>

			<SheetContent>
				<form
					action={dispatch}
					className="flex flex-col h-full"
					onSubmit={() => form.handleSubmit()}
				>
					<SheetHeader className="mb-5">
						<SheetTitle>Nouvelle catégorie de produit</SheetTitle>
						{currentCategory && (
							<p className="text-sm text-muted-foreground">
								Sous-catégorie de : {currentCategory.name}
							</p>
						)}
					</SheetHeader>

					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Contenu du formulaire avec défilement */}
					<div className="flex-1 overflow-y-auto pr-1 space-y-6">
						{/* Informations de base */}
						<div className="space-y-4 mx-auto w-full">
							{/* Nom */}
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
										label="Nom de la catégorie"
										placeholder="Ex: Électronique, Vêtements, etc."
										required
										disabled={isPending}
									/>
								)}
							</form.AppField>

							{/* Description */}
							<form.AppField name="description">
								{(field) => (
									<field.TextareaField
										label="Description"
										placeholder="Description de la catégorie..."
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
									{isPending ? "Création en cours..." : "Créer la catégorie"}
								</Button>
							)}
						</form.Subscribe>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
