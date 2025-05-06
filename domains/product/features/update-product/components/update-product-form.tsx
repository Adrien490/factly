"use client";

import { Button, DotsLoader, FormLabel } from "@/shared/components";
import {
	FieldInfo,
	FormErrors,
	FormFooter,
	FormLayout,
	FormSection,
	useAppForm,
} from "@/shared/components/forms";
import { UploadDropzone, useUploadThing } from "@/shared/lib/uploadthing";

import { ProductStatus } from "@prisma/client";
import { GetProductReturn } from "../../get-product/types";

import { mergeForm, useTransform } from "@tanstack/react-form";

import { VAT_RATES } from "@/domains/product/constants/vat-rates";
import { generateReference } from "@/shared/utils";
import { ImageIcon, Receipt, Tag, Wand2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useUpdateProduct } from "../hooks/use-update-product";

interface UpdateProductFormProps {
	product: NonNullable<GetProductReturn>;
}

export function UpdateProductForm({ product }: UpdateProductFormProps) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const { isUploading, startUpload } = useUploadThing("productImage");

	// Action state with callbacks
	const { state, dispatch, isPending } = useUpdateProduct();

	// TanStack Form setup
	const form = useAppForm({
		defaultValues: {
			id: product.id,
			organizationId: product.organizationId,
			name: product.name,
			reference: product.reference,
			description: product.description || "",
			status: product.status,
			price: product.price,
			vatRate: product.vatRate,
			imageUrl: product.imageUrl || "",
			categoryId: product.categoryId || "",
			supplierId: product.supplierId || "",
		},

		transform: useTransform(
			(baseForm) => mergeForm(baseForm, (state as unknown) ?? {}),
			[state]
		),
	});

	// Fonction pour générer une référence automatique
	const handleGenerateReference = async () => {
		try {
			const reference = await generateReference({
				prefix: "PRD",
				format: "alphanumeric",
				length: 2,
				separator: "-",
			});

			form.setFieldValue("reference", reference);
		} catch (error) {
			console.error("Erreur lors de la génération de référence", error);
		}
	};

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
			<form.Field name="id">
				{(field) => <input type="hidden" name="id" value={field.state.value} />}
			</form.Field>

			<form.Field name="organizationId">
				{(field) => (
					<input
						type="hidden"
						name="organizationId"
						value={field.state.value}
					/>
				)}
			</form.Field>

			<form.Field name="imageUrl">
				{(field) => (
					<input
						type="hidden"
						name="imageUrl"
						value={field.state.value ?? ""}
					/>
				)}
			</form.Field>

			<FormLayout columns={2}>
				{/* Section 1: Informations de base */}
				<FormSection
					title="Informations de base"
					description="Renseignez les informations principales du produit"
					icon={Tag}
				>
					<div className="space-y-4">
						<form.AppField
							name="reference"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "La référence est requise";
									return undefined;
								},
							}}
						>
							{(field) => (
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<FormLabel htmlFor="reference">
											Référence
											<span className="text-destructive ml-1">*</span>
										</FormLabel>
										<Button
											type="button"
											variant="ghost"
											disabled={isPending}
											size="sm"
											onClick={handleGenerateReference}
											title="Générer une référence unique"
											className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
										>
											<Wand2 className="h-3 w-3 mr-1" />
											Générer
										</Button>
									</div>
									<field.InputField disabled={isPending} placeholder="REF123" />
									<FieldInfo field={field} />
								</div>
							)}
						</form.AppField>

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
									label="Nom du produit*"
									disabled={isPending}
									placeholder="Produit ABC"
								/>
							)}
						</form.AppField>

						<form.AppField name="description">
							{(field) => (
								<field.TextareaField
									label="Description"
									disabled={isPending}
									placeholder="Description détaillée du produit..."
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 2: Image du produit */}
				<FormSection
					title="Image du produit"
					description="Ajoutez une image pour illustrer votre produit"
					icon={ImageIcon}
				>
					<form.Field name="imageUrl">
						{(field) => (
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<FormLabel className="text-base">Image du produit</FormLabel>
									{field.state.value && (
										<Button
											disabled={isPending}
											type="button"
											variant="ghost"
											size="sm"
											className="text-destructive"
											onClick={() => field.handleChange("")}
										>
											Supprimer
										</Button>
									)}
								</div>

								{field.state.value ? (
									<div className="flex items-center justify-center">
										<div className="relative h-24 w-24 rounded-md overflow-hidden">
											<Image
												src={field.state.value}
												alt="Image du produit"
												fill
												sizes="96px"
												className="object-cover"
												priority
											/>
										</div>
									</div>
								) : (
									<div className="relative">
										<UploadDropzone
											endpoint="productImage"
											onChange={async (files) => {
												const res = await startUpload(files);
												const imageUrl = res?.[0]?.serverData?.url;
												if (imageUrl) {
													field.handleChange(imageUrl);
												}
											}}
											onUploadError={(error) => {
												console.error(error);
												toast.error("Erreur lors de l'upload", {
													description:
														"Impossible de charger l'image. Veuillez réessayer.",
												});
											}}
											className="border-2 border-dashed border-muted-foreground/25 h-44 rounded-lg bg-muted/5 hover:bg-muted/10 transition-all duration-300 ut-label:text-sm ut-allowed-content:hidden hover:border-primary/30 ut-container:cursor-pointer ut-button:bg-primary ut-button:hover:bg-primary/90"
										/>

										{isUploading && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-[2px] rounded-lg transition-all duration-300">
												<div className="flex items-center gap-3 flex-col">
													<DotsLoader color="primary" size="xs" />
												</div>
											</div>
										)}
									</div>
								)}
								<p className="text-xs text-muted-foreground mt-2">
									Formats acceptés: JPG, PNG ou SVG. Max. 2MB.
								</p>
								<FieldInfo field={field} />
							</div>
						)}
					</form.Field>
				</FormSection>

				{/* Section 3: Tarification */}
				<FormSection
					title="Tarification"
					description="Définissez le prix et le taux de TVA"
					icon={Receipt}
				>
					<div className="space-y-4">
						<form.AppField
							name="price"
							validators={{
								onChange: ({ value }) => {
									if (value === undefined || value < 0)
										return "Le prix doit être positif";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.InputField
									label="Prix HT*"
									type="number"
									min={0}
									step={0.01}
									disabled={isPending}
									placeholder="0.00"
									value={
										field.state.value === 0 ? "" : String(field.state.value)
									}
								/>
							)}
						</form.AppField>

						<form.AppField
							name="vatRate"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le taux de TVA est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Taux de TVA*"
									disabled={isPending}
									placeholder="Sélectionner un taux..."
									options={VAT_RATES}
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 4: Catégories et fournisseurs */}
				<FormSection
					icon={Tag}
					title="Classification"
					description="Associez une catégorie et un fournisseur au produit"
				>
					<div className="space-y-4">
						<form.AppField name="categoryId">
							{(field) => (
								<div className="space-y-1.5">
									<field.SelectField
										label="Catégorie"
										disabled={isPending}
										placeholder="Sélectionner une catégorie..."
										options={[]}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.AppField>

						<form.AppField name="supplierId">
							{(field) => (
								<div className="space-y-1.5">
									<field.SelectField
										label="Fournisseur"
										disabled={isPending}
										placeholder="Sélectionner un fournisseur..."
										options={[]}
									/>
									<FieldInfo field={field} />
								</div>
							)}
						</form.AppField>
					</div>
				</FormSection>

				{/* Section 5: Statut */}
				<FormSection
					title="Statut"
					description="Définissez le statut du produit"
					icon={Tag}
				>
					<div className="space-y-4">
						<form.AppField
							name="status"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Le statut est requis";
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.SelectField
									label="Statut*"
									disabled={isPending}
									placeholder="Sélectionner un statut..."
									options={[
										{ value: ProductStatus.ACTIVE, label: "Actif" },
										{ value: ProductStatus.INACTIVE, label: "Inactif" },
										{ value: ProductStatus.DRAFT, label: "Brouillon" },
									]}
								/>
							)}
						</form.AppField>
					</div>
				</FormSection>
			</FormLayout>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<FormFooter
						disabled={!canSubmit || isPending || isUploading}
						cancelHref={`/dashboard/${organizationId}/products/${product.id}`}
						submitLabel="Mettre à jour le produit"
						isPending={isPending}
					/>
				)}
			</form.Subscribe>
		</form>
	);
}
