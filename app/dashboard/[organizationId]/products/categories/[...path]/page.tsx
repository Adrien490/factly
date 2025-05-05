import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import {
	buildCategoryPath,
	getCategoryByPath,
} from "@/domains/product-category/utils/category-path";
import {
	PageContainer,
	PageHeader,
	SearchForm,
	Toolbar,
} from "@/shared/components";
import { Breadcrumbs } from "@/shared/components/breadcrumbs/breadcrumbs";
import { Badge } from "@/shared/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import {
	ArrowUpRight,
	Edit,
	Eye,
	Folder,
	FolderTree,
	MoreHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		organizationId: string;
		path: string[];
	}>;
}

export default async function ProductCategoryPage({ params }: Props) {
	const { organizationId, path } = await params;

	// Récupérer toutes les catégories
	const categories = await getProductCategories({
		organizationId,
		filters: {},
		search: "",
	});

	// Trouver la catégorie courante en utilisant le chemin
	const currentCategory = await getCategoryByPath(categories, path);

	// Si la catégorie n'existe pas, retourner une 404
	if (!currentCategory) {
		return notFound();
	}

	// Récupérer les sous-catégories de la catégorie courante
	const childCategories = categories.filter(
		(category) => category.parentId === currentCategory.id
	);

	// Construire les éléments du breadcrumb
	const breadcrumbItems = buildCategoryPath(categories, currentCategory);

	return (
		<PageContainer>
			<Breadcrumbs
				items={[
					{
						label: "Catégories",
						href: `/dashboard/${organizationId}/products/categories`,
					},
					...breadcrumbItems,
				]}
				className="mb-4"
			/>

			<PageHeader
				title={currentCategory.name}
				description={currentCategory.description || ""}
			/>

			<Toolbar
				leftContent={
					<>
						<SearchForm
							paramName="search"
							placeholder="Rechercher une sous-catégorie..."
							className="flex-1 shrink-0"
						/>
					</>
				}
				rightContent={
					<>
						<Suspense fallback={<></>}>
							<CreateProductCategorySheetForm
								categoriesPromise={Promise.resolve(categories)}
							/>
						</Suspense>
					</>
				}
			/>

			{/* Affichage des sous-catégories */}
			<div className="mt-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-xl flex items-center gap-2">
							<FolderTree className="h-5 w-5" />
							Sous-catégories
						</CardTitle>
						<CardDescription>
							{childCategories.length > 0
								? `${childCategories.length} sous-catégories trouvées dans "${currentCategory.name}"`
								: `Aucune sous-catégorie trouvée dans "${currentCategory.name}"`}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{childCategories.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[300px]">Nom</TableHead>
										<TableHead>Description</TableHead>
										<TableHead className="w-[150px]">Statut</TableHead>
										<TableHead className="w-[100px]">Produits</TableHead>
										<TableHead className="w-[100px] text-right">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{childCategories.map((category) => (
										<TableRow key={category.id}>
											<TableCell className="font-medium">
												<div className="flex items-center gap-2">
													<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden">
														{category.imageUrl ? (
															<Image
																src={category.imageUrl}
																width={32}
																height={32}
																alt={category.name}
																className="object-cover"
															/>
														) : (
															<Folder className="h-4 w-4 text-muted-foreground" />
														)}
													</div>
													<div>
														<Link
															href={`/dashboard/${organizationId}/products/categories/${path.join(
																"/"
															)}/${category.slug}`}
															className="hover:underline flex items-center"
														>
															{category.name}{" "}
															<ArrowUpRight className="ml-1 h-3 w-3" />
														</Link>
														<span className="text-xs text-muted-foreground">
															/{path.join("/")}/${category.slug}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{category.description || "-"}
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={cn(
														"px-2 py-0 text-xs",
														category.status === "ACTIVE" &&
															"bg-green-100 text-green-700 border-green-200",
														category.status === "INACTIVE" &&
															"bg-amber-100 text-amber-700 border-amber-200",
														category.status === "ARCHIVED" &&
															"bg-red-100 text-red-700 border-red-200"
													)}
												>
													{category.status === "ACTIVE" && "Active"}
													{category.status === "INACTIVE" && "Inactive"}
													{category.status === "ARCHIVED" && "Archivée"}
												</Badge>
											</TableCell>
											<TableCell className="text-center">0</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Link
														href={`/dashboard/${organizationId}/products/categories/${path.join(
															"/"
														)}/${category.slug}`}
														className="p-2 hover:bg-muted rounded-md"
													>
														<Eye className="h-4 w-4" />
													</Link>
													<Link
														href={`/dashboard/${organizationId}/products/categories/${path.join(
															"/"
														)}/${category.slug}/edit`}
														className="p-2 hover:bg-muted rounded-md"
													>
														<Edit className="h-4 w-4" />
													</Link>
													<button className="p-2 hover:bg-muted rounded-md">
														<MoreHorizontal className="h-4 w-4" />
													</button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						) : (
							<div className="py-8 text-center text-muted-foreground">
								Aucune sous-catégorie trouvée. Créez-en une dès maintenant !
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</PageContainer>
	);
}

// Helper function pour le className conditionnel
function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
