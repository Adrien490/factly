"use client";

import { FormErrors, useAppForm } from "@/shared/components/forms";
import {
	Button,
	FormLabel,
	Sheet,
	SheetContent,
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
	categoriesPromise: Promise<ProductCategory[]>;
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
			<SheetContent className="">
				<SheetHeader>
					<SheetTitle>Nouvelle catégorie de produit</SheetTitle>
				</SheetHeader>

				<form
					action={dispatch}
					className="mt-6"
					onSubmit={() => form.handleSubmit()}
				>
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

					<form.AppField name="imageUrl">
						{(field) => (
							<input type="hidden" name="imageUrl" value={field.state.value} />
						)}
					</form.AppField>

					<div className="space-y-5 overflow-y-auto max-h-[calc(100vh-16rem)]">
						{/* Image de la catégorie */}
						<div className="space-y-4">
							<div className="text-sm font-medium text-muted-foreground">
								Identité visuelle
							</div>

							<form.AppField name="imageUrl">
								{(field) => (
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<FormLabel>Image de la catégorie</FormLabel>
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
											<div className="flex items-center justify-center">
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
											<div className="relative">
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

						{/* Informations principales */}
						<div className="space-y-4">
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

							{/* Champ slug caché */}
							<form.AppField name="slug">
								{(field) => (
									<input type="hidden" name="slug" value={field.state.value} />
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

						{/* Hiérarchie */}
						<div className="space-y-4">
							<div className="text-sm font-medium text-muted-foreground">
								Structure hiérarchique
							</div>

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
						</div>

						{/* Statut */}
						<div className="space-y-4">
							<div className="text-sm font-medium text-muted-foreground">
								Paramètres de visibilité
							</div>

							{/* Statut de la catégorie */}
							<form.AppField name="status">
								{(field) => (
									<field.SelectField
										label="Statut"
										placeholder="Sélectionnez un statut"
										disabled={isPending}
										options={[
											{ value: ProductCategoryStatus.ACTIVE, label: "Active" },
											{
												value: ProductCategoryStatus.INACTIVE,
												label: "Inactive",
											},
											{
												value: ProductCategoryStatus.ARCHIVED,
												label: "Archivée",
											},
										]}
									/>
								)}
							</form.AppField>
						</div>
					</div>

					{/* Bouton de soumission */}
					<form.Subscribe selector={(state) => state.canSubmit}>
						{(canSubmit) => (
							<Button
								type="submit"
								className="w-full mt-6"
								disabled={!canSubmit || isPending}
							>
								Créer la catégorie
							</Button>
						)}
					</form.Subscribe>
				</form>
			</SheetContent>
		</Sheet>
	);
}
