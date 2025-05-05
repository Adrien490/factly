import {
	Badge,
	EmptyState,
	ItemCheckbox,
	SelectAllCheckbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { ChevronRight, Folder, Search } from "lucide-react";
import { use } from "react";

import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import { buildPathString } from "@/domains/product-category/utils/category-path";
import { SelectionProvider } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import Image from "next/image";
import Link from "next/link";
import { GetProductCategoriesReturn } from "../types";

export interface ProductCategoryDataTableProps {
	categoriesPromise: Promise<GetProductCategoriesReturn>;
	organizationId: string;
}

export function ProductCategoryDataTable({
	categoriesPromise,
	organizationId,
}: ProductCategoryDataTableProps) {
	const categories = use(categoriesPromise);

	// Récupérer les catégories racines (sans parent)
	const rootCategories = categories.filter((category) => !category.parentId);
	const categoryIds = categories.map((category) => category.id);

	if (categories.length === 0) {
		return (
			<EmptyState
				icon={<Search className="w-10 h-10" />}
				title="Aucune catégorie trouvée"
				description="Aucune catégorie n'a été trouvée. Vous pouvez en créer une nouvelle."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<SelectionProvider>
			<Table className="group-has-[[data-pending]]:animate-pulse">
				<TableHeader>
					<TableRow>
						<TableHead key="select" role="columnheader">
							<SelectAllCheckbox itemIds={categoryIds} />
						</TableHead>
						<TableHead key="name" role="columnheader" className="w-[300px]">
							Nom
						</TableHead>
						<TableHead key="description" role="columnheader">
							Description
						</TableHead>
						<TableHead key="status" role="columnheader" className="w-[150px]">
							Statut
						</TableHead>
						<TableHead
							key="children"
							role="columnheader"
							className="w-[100px] text-center"
						>
							Sous-catégories
						</TableHead>
						<TableHead
							key="actions"
							role="columnheader"
							className="w-[100px] text-right"
						>
							<></>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rootCategories.map((category) => {
						// Récupérer les enfants directs de la catégorie
						const children = categories.filter(
							(child) => child.parentId === category.id
						);

						const statusOption = PRODUCT_CATEGORY_STATUSES.find(
							(option) => option.value === category.status
						);

						return (
							<>
								{/* Catégorie principale */}
								<TableRow key={category.id} role="row" tabIndex={0}>
									<TableCell role="gridcell">
										<ItemCheckbox itemId={category.id} />
									</TableCell>
									<TableCell role="gridcell" className="font-medium">
										<div className="flex items-center gap-2">
											<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
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
											<div className="min-w-0">
												<Link
													href={`/dashboard/${organizationId}/products/categories/${category.slug}`}
													className="hover:underline flex items-center truncate max-w-[220px]"
												>
													<span className="truncate">{category.name}</span>
												</Link>
												<span className="text-xs text-muted-foreground truncate block max-w-[220px]">
													/{category.slug}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell role="gridcell" className="text-muted-foreground">
										<div className="truncate max-w-[300px]">
											{category.description || "-"}
										</div>
									</TableCell>
									<TableCell role="gridcell">
										<Badge
											variant="outline"
											className={cn(
												"px-2 py-0 text-xs",
												statusOption &&
													`bg-${statusOption.color}/10 text-${statusOption.color} border-${statusOption.color}/40`,
												category.status === "ACTIVE" &&
													"bg-green-100 text-green-700 border-green-200",
												category.status === "INACTIVE" &&
													"bg-amber-100 text-amber-700 border-amber-200",
												category.status === "ARCHIVED" &&
													"bg-red-100 text-red-700 border-red-200"
											)}
										>
											{statusOption?.label || category.status}
										</Badge>
									</TableCell>
									<TableCell role="gridcell" className="text-center">
										{category.childCount || children.length || 0}
									</TableCell>
									<TableCell role="gridcell" className="text-right"></TableCell>
								</TableRow>

								{/* Sous-catégories */}
								{children.map((childCategory) => {
									const childPath = buildPathString(categories, childCategory);
									const childStatusOption = PRODUCT_CATEGORY_STATUSES.find(
										(option) => option.value === childCategory.status
									);

									return (
										<TableRow key={childCategory.id} role="row" tabIndex={0}>
											<TableCell role="gridcell">
												<ItemCheckbox itemId={childCategory.id} />
											</TableCell>
											<TableCell role="gridcell" className="font-medium">
												<div className="flex items-center gap-2 ml-8">
													<ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
													<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
														{childCategory.imageUrl ? (
															<Image
																src={childCategory.imageUrl}
																width={32}
																height={32}
																alt={childCategory.name}
																className="object-cover"
															/>
														) : (
															<Folder className="h-4 w-4 text-muted-foreground" />
														)}
													</div>
													<div className="min-w-0">
														<Link
															href={`/dashboard/${organizationId}/products/categories/${childPath}`}
															className="hover:underline flex items-center truncate max-w-[180px]"
														>
															<span className="truncate">
																{childCategory.name}
															</span>
														</Link>
														<span className="text-xs text-muted-foreground truncate block max-w-[180px]">
															/{childPath}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell
												role="gridcell"
												className="text-muted-foreground"
											>
												<div className="truncate max-w-[300px]">
													{childCategory.description || "-"}
												</div>
											</TableCell>
											<TableCell role="gridcell">
												<Badge
													variant="outline"
													className={cn(
														"px-2 py-0 text-xs",
														childStatusOption &&
															`bg-${childStatusOption.color}/10 text-${childStatusOption.color} border-${childStatusOption.color}/40`,
														childCategory.status === "ACTIVE" &&
															"bg-green-100 text-green-700 border-green-200",
														childCategory.status === "INACTIVE" &&
															"bg-amber-100 text-amber-700 border-amber-200",
														childCategory.status === "ARCHIVED" &&
															"bg-red-100 text-red-700 border-red-200"
													)}
												>
													{childStatusOption?.label || childCategory.status}
												</Badge>
											</TableCell>
											<TableCell role="gridcell" className="text-center">
												{childCategory.childCount || 0}
											</TableCell>
											<TableCell
												role="gridcell"
												className="text-right"
											></TableCell>
										</TableRow>
									);
								})}
							</>
						);
					})}
				</TableBody>
			</Table>
		</SelectionProvider>
	);
}
