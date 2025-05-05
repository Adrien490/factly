"use client";

import { GetProductCategoriesReturn } from "@/domains/product-category/features/get-product-categories/types";
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
import { useParams, useRouter } from "next/navigation";
import { ReactNode, use, useActionState, useMemo, useState } from "react";
import { toast } from "sonner";
import { createProductCategory } from "../actions/create-product-category";
import { createProductCategorySchema } from "../schemas";

interface CreateProductCategoryDefaultValues {
	name?: string;
	description?: string;
	parentId?: string | null;
}

interface CreateProductCategorySheetFormProps {
	categoriesPromise: Promise<GetProductCategoriesReturn>;
	children?: ReactNode;
	defaultValues?: CreateProductCategoryDefaultValues;
}

export function CreateProductCategorySheetForm({
	categoriesPromise,
	children,
	defaultValues = {},
}: CreateProductCategorySheetFormProps) {
	const response = use(categoriesPromise);
	const { categories } = response;
	const [isOpen, setIsOpen] = useState(false);
	const params = useParams();
	const organizationId = params.organizationId as string;
	const router = useRouter();

	// Trouver la catégorie parente si un parentId est fourni
	const parentCategory = useMemo(() => {
		// Si parentId est undefined ou null, on n'a pas de catégorie parente
		if (
			defaultValues.parentId === undefined ||
			defaultValues.parentId === null
		) {
			return null;
		}

		// Sinon, on cherche la catégorie correspondante
		return categories.find((cat) => cat.id === defaultValues.parentId) || null;
	}, [categories, defaultValues.parentId]);

	// Flag pour savoir si on doit montrer le champ parentId ou non
	const showParentIdField = defaultValues.parentId !== undefined;
	// Flag pour savoir si on doit montrer le select ou un champ en lecture seule
	const showParentAsReadOnly = Boolean(parentCategory);

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
											`/dashboard/${data.data.organizationId}/products/categories/${data.data.id}`
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
			organizationId,
			name: defaultValues.name || "",
			description: defaultValues.description || "",
			parentId:
				defaultValues.parentId !== undefined
					? defaultValues.parentId === null
						? "none"
						: defaultValues.parentId
					: "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Pour le debug
	console.log("[CREATE_PRODUCT_CATEGORY_FORM]", {
		defaultParentId: defaultValues.parentId,
		parentCategory,
		showParentIdField,
		showParentAsReadOnly,
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
						{parentCategory && (
							<p className="text-sm text-muted-foreground">
								Sous-catégorie de : {parentCategory.name}
							</p>
						)}
					</SheetHeader>

					{/* Erreurs globales du formulaire */}
					<form.Subscribe selector={(state) => state.errors}>
						{(errors) => <FormErrors errors={errors} />}
					</form.Subscribe>

					{/* Champs cachés */}
					<form.AppField name="organizationId">
						{(field) => (
							<input
								type="hidden"
								name="organizationId"
								value={field.state.value}
							/>
						)}
					</form.AppField>

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

							{/* Catégorie parente - affiché seulement si parentId est défini dans defaultValues */}
							{showParentIdField ? (
								<>
									{showParentAsReadOnly ? (
										<div className="space-y-2">
											<label className="text-sm font-medium">
												Catégorie parente
											</label>
											<div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
												{parentCategory?.name ||
													"Aucune catégorie parente sélectionnée"}
											</div>
											<form.AppField name="parentId">
												{(field) => (
													<input
														type="hidden"
														name="parentId"
														value={field.state.value}
													/>
												)}
											</form.AppField>
										</div>
									) : (
										<form.AppField name="parentId">
											{(field) => (
												<field.SelectField
													label="Catégorie parente"
													placeholder="Sélectionnez une catégorie parente"
													disabled={isPending}
													options={[
														{
															value: "none",
															label: "Aucune (catégorie principale)",
														},
														...categories.map((category) => ({
															value: category.id,
															label: category.name,
														})),
													]}
												/>
											)}
										</form.AppField>
									)}
								</>
							) : (
								// Si parentId n'est pas défini dans defaultValues, cacher le champ
								<form.AppField name="parentId">
									{(field) => (
										<input
											type="hidden"
											name="parentId"
											value={field.state.value}
										/>
									)}
								</form.AppField>
							)}

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
