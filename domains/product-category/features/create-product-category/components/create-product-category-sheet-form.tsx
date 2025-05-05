"use client";

import { GetProductCategoriesReturn } from "@/domains/product-category/features/get-product-categories/types";
import { FormErrors, useAppForm } from "@/shared/components/forms";
import {
	Button,
	FormLabel,
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/components/ui";
import { UploadDropzone, useUploadThing } from "@/shared/lib/uploadthing";
import { createToastCallbacks, withCallbacks } from "@/shared/utils";
import { ProductCategory, ProductCategoryStatus } from "@prisma/client";
import { mergeForm, useTransform } from "@tanstack/react-form";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, use, useActionState, useState } from "react";
import { toast } from "sonner";
import { createProductCategory } from "../actions/create-product-category";
import { createProductCategorySchema } from "../schemas";

interface CreateProductCategorySheetFormProps {
	categoriesPromise: Promise<GetProductCategoriesReturn>;
	children?: ReactNode;
}

export function CreateProductCategorySheetForm({
	categoriesPromise,
	children,
}: CreateProductCategorySheetFormProps) {
	const categories = use(categoriesPromise);
	const [isOpen, setIsOpen] = useState(false);
	const params = useParams();
	const organizationId = params.organizationId as string;
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

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			organizationId,
			name: "",
			slug: "",
			description: "",
			parentId: "",
			status: ProductCategoryStatus.ACTIVE,
			imageUrl: "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Gestion de l'upload d'images
	const { isUploading, startUpload } = useUploadThing("categoryImage");

	// Fonction pour générer le slug à partir du nom
	const handleGenerateSlug = (name: string) => {
		if (name) {
			return name
				.toLowerCase()
				.trim()
				.replace(/[^\w\s-]/g, "") // Supprime les caractères spéciaux
				.replace(/\s+/g, "-") // Remplace les espaces par des tirets
				.replace(/-+/g, "-"); // Évite les tirets consécutifs
		}
		return "";
	};

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

					<form.AppField name="slug">
						{(field) => (
							<input type="hidden" name="slug" value={field.state.value} />
						)}
					</form.AppField>

					<form.AppField name="imageUrl">
						{(field) => (
							<input type="hidden" name="imageUrl" value={field.state.value} />
						)}
					</form.AppField>

					<form.AppField name="status">
						{() => (
							<input
								type="hidden"
								name="status"
								value={ProductCategoryStatus.ACTIVE}
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
										// Générer automatiquement le slug à partir du nom
										form.setFieldValue("slug", handleGenerateSlug(value));
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

							{/* Catégorie parente */}
							<form.AppField name="parentId">
								{(field) => (
									<field.SelectField
										label="Catégorie parente"
										placeholder="Sélectionnez une catégorie parente"
										disabled={isPending}
										options={[
											{ value: "none", label: "Aucune (catégorie principale)" },
											...categories.map((category) => ({
												value: category.id,
												label: category.name,
											})),
										]}
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

						{/* Image de la catégorie */}
						<div className="space-y-4 mx-auto w-full">
							<form.AppField name="imageUrl">
								{(field) => (
									<div className="space-y-3 w-full">
										<div className="flex items-center justify-between">
											<FormLabel>Image</FormLabel>
											{field.state.value && (
												<Button
													disabled={isPending}
													type="button"
													variant="ghost"
													size="sm"
													className="text-destructive flex items-center gap-1"
													onClick={() => form.setFieldValue("imageUrl", "")}
												>
													<X className="h-4 w-4" />
													Supprimer
												</Button>
											)}
										</div>

										{field.state.value ? (
											<div className="flex items-center justify-center w-full">
												<div className="relative h-32 w-32 rounded-md overflow-hidden">
													<Image
														src={field.state.value}
														alt="Image de la catégorie"
														fill
														sizes="128px"
														className="object-cover"
														priority
													/>
												</div>
											</div>
										) : (
											<div className="relative w-full">
												<UploadDropzone
													endpoint="categoryImage"
													onChange={async (files) => {
														const res = await startUpload(files);
														const imageUrl = res?.[0]?.serverData?.url;
														if (imageUrl) {
															form.setFieldValue("imageUrl", imageUrl);
														}
													}}
													onUploadError={(error) => {
														console.error(error);
														toast.error("Erreur lors de l'upload", {
															description:
																"Impossible de charger l'image. Veuillez réessayer.",
														});
													}}
													className="border-2 border-dashed border-muted-foreground/25 h-32 rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-300 ut-label:text-sm ut-allowed-content:hidden hover:border-primary/30 ut-container:cursor-pointer ut-button:bg-primary ut-button:hover:bg-primary/90"
												/>

												{isUploading && (
													<div className="absolute inset-0 flex items-center justify-center bg-background/80">
														<div className="text-sm text-muted-foreground">
															Chargement...{" "}
															<Upload className="h-4 w-4 ml-2 animate-bounce" />
														</div>
													</div>
												)}
											</div>
										)}
									</div>
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
