"use client";

import {
	Badge,
	EmptyState,
	ItemCheckbox,
	SelectAllCheckbox,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { SelectionProvider } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import {
	CalendarClock,
	ChevronDown,
	ChevronRight,
	Clock,
	Folder,
	Package2,
	Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, use, useState } from "react";

import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import { buildPathString } from "@/domains/product-category/utils/category-path";
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
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	// Récupérer les catégories racines (sans parent)
	const rootCategories = categories.filter((category) => !category.parentId);
	const categoryIds = categories.map((category) => category.id);

	// Fonction pour basculer l'état d'expansion d'une catégorie
	const toggleCategory = (categoryId: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	};

	// Vérifier si une catégorie a des enfants
	const hasChildren = (categoryId: string) => {
		return categories.some((category) => category.parentId === categoryId);
	};

	// Formatage de la date
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("fr-FR", {
			day: "2-digit",
			month: "short",
			year: "numeric",
		}).format(new Date(date));
	};

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
						<TableHead key="name" role="columnheader" className="w-[400px]">
							Catégorie & Chemin
						</TableHead>
						<TableHead key="description" role="columnheader">
							Description
						</TableHead>
						<TableHead key="status" role="columnheader" className="w-[120px]">
							Statut
						</TableHead>
						<TableHead
							key="products"
							role="columnheader"
							className="w-[100px] text-center"
						>
							<div className="flex items-center justify-center gap-1">
								<Package2 className="h-4 w-4" />
								<span>Produits</span>
							</div>
						</TableHead>
						<TableHead key="metadata" role="columnheader" className="w-[180px]">
							<div className="flex items-center gap-1">
								<CalendarClock className="h-4 w-4" />
								<span>Métadonnées</span>
							</div>
						</TableHead>
						<TableHead
							key="actions"
							role="columnheader"
							className="w-[80px] text-right"
						>
							<></>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rootCategories.map((category) => {
						// Vérifier si la catégorie a des enfants
						const hasChildCategories = hasChildren(category.id);
						const isExpanded = expandedCategories.has(category.id);
						const directChildren = categories.filter(
							(child) => child.parentId === category.id
						);

						const statusOption = PRODUCT_CATEGORY_STATUSES.find(
							(option) => option.value === category.status
						);

						return (
							<Fragment key={category.id}>
								{/* Catégorie principale */}
								<TableRow role="row" tabIndex={0} className="group">
									<TableCell role="gridcell">
										<ItemCheckbox itemId={category.id} />
									</TableCell>
									<TableCell role="gridcell" className="font-medium">
										<div className="flex items-center gap-2">
											{hasChildCategories ? (
												<button
													onClick={() => toggleCategory(category.id)}
													className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
													aria-label={
														isExpanded
															? "Réduire la catégorie"
															: "Développer la catégorie"
													}
												>
													{isExpanded ? (
														<ChevronDown className="h-4 w-4 text-muted-foreground" />
													) : (
														<ChevronRight className="h-4 w-4 text-muted-foreground" />
													)}
												</button>
											) : (
												<div className="h-6 w-6" />
											)}
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
													className="hover:underline flex items-center truncate max-w-[300px] font-medium"
												>
													<span className="truncate">{category.name}</span>
												</Link>
												<div className="flex items-center text-xs text-muted-foreground truncate max-w-[300px]">
													<span className="truncate">/{category.slug}</span>
												</div>
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
										<div className="w-full flex justify-center">
											<Badge variant="secondary" className="text-xs">
												0
											</Badge>
										</div>
									</TableCell>
									<TableCell role="gridcell">
										<div className="space-y-1">
											<div className="flex items-center text-xs text-muted-foreground">
												<Clock className="h-3 w-3 mr-1" />
												<span>Créé le {formatDate(category.createdAt)}</span>
											</div>
											<div className="flex items-center text-xs text-muted-foreground">
												<Clock className="h-3 w-3 mr-1" />
												<span>Modifié le {formatDate(category.updatedAt)}</span>
											</div>
										</div>
									</TableCell>
									<TableCell role="gridcell" className="text-right">
										<div className="invisible group-hover:visible">
											<Link
												href={`/dashboard/${organizationId}/products/categories/${category.slug}/edit`}
												className="text-xs text-primary hover:underline"
											>
												Éditer
											</Link>
										</div>
									</TableCell>
								</TableRow>

								{/* Sous-catégories (affichées uniquement si la catégorie est développée) */}
								{isExpanded &&
									directChildren.map((childCategory) => {
										const childPath = buildPathString(
											categories,
											childCategory
										);
										const hasGrandchildren = hasChildren(childCategory.id);
										const isChildExpanded = expandedCategories.has(
											childCategory.id
										);
										const grandchildren = categories.filter(
											(child) => child.parentId === childCategory.id
										);
										const childStatusOption = PRODUCT_CATEGORY_STATUSES.find(
											(option) => option.value === childCategory.status
										);

										return (
											<Fragment key={childCategory.id}>
												<TableRow role="row" tabIndex={0} className="group">
													<TableCell role="gridcell">
														<ItemCheckbox itemId={childCategory.id} />
													</TableCell>
													<TableCell role="gridcell" className="font-medium">
														<div className="flex items-center gap-2 ml-8">
															{hasGrandchildren ? (
																<button
																	onClick={() =>
																		toggleCategory(childCategory.id)
																	}
																	className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
																	aria-label={
																		isChildExpanded
																			? "Réduire la sous-catégorie"
																			: "Développer la sous-catégorie"
																	}
																>
																	{isChildExpanded ? (
																		<ChevronDown className="h-4 w-4 text-muted-foreground" />
																	) : (
																		<ChevronRight className="h-4 w-4 text-muted-foreground" />
																	)}
																</button>
															) : (
																<div className="h-6 w-6" />
															)}
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
																	className="hover:underline flex items-center truncate max-w-[260px] font-medium"
																>
																	<span className="truncate">
																		{childCategory.name}
																	</span>
																</Link>
																<div className="flex items-center text-xs text-muted-foreground truncate max-w-[260px]">
																	<span className="text-xs font-medium">
																		{category.name}
																	</span>
																	<span className="mx-1">/</span>
																	<span className="truncate">
																		{childCategory.slug}
																	</span>
																</div>
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
														<div className="w-full flex justify-center">
															<Badge variant="secondary" className="text-xs">
																0
															</Badge>
														</div>
													</TableCell>
													<TableCell role="gridcell">
														<div className="space-y-1">
															<div className="flex items-center text-xs text-muted-foreground">
																<Clock className="h-3 w-3 mr-1" />
																<span>
																	Créé le {formatDate(childCategory.createdAt)}
																</span>
															</div>
															<div className="flex items-center text-xs text-muted-foreground">
																<Clock className="h-3 w-3 mr-1" />
																<span>
																	Modifié le{" "}
																	{formatDate(childCategory.updatedAt)}
																</span>
															</div>
														</div>
													</TableCell>
													<TableCell role="gridcell" className="text-right">
														<div className="invisible group-hover:visible">
															<Link
																href={`/dashboard/${organizationId}/products/categories/${childPath}/edit`}
																className="text-xs text-primary hover:underline"
															>
																Éditer
															</Link>
														</div>
													</TableCell>
												</TableRow>

												{/* Petits-enfants (troisième niveau) */}
												{isChildExpanded &&
													grandchildren.map((grandchild) => {
														const grandchildPath = buildPathString(
															categories,
															grandchild
														);
														const grandchildStatusOption =
															PRODUCT_CATEGORY_STATUSES.find(
																(option) => option.value === grandchild.status
															);

														return (
															<TableRow
																key={grandchild.id}
																role="row"
																tabIndex={0}
																className="group"
															>
																<TableCell role="gridcell">
																	<ItemCheckbox itemId={grandchild.id} />
																</TableCell>
																<TableCell
																	role="gridcell"
																	className="font-medium"
																>
																	<div className="flex items-center gap-2 ml-16">
																		<div className="h-6 w-6" />
																		<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
																			{grandchild.imageUrl ? (
																				<Image
																					src={grandchild.imageUrl}
																					width={32}
																					height={32}
																					alt={grandchild.name}
																					className="object-cover"
																				/>
																			) : (
																				<Folder className="h-4 w-4 text-muted-foreground" />
																			)}
																		</div>
																		<div className="min-w-0">
																			<Link
																				href={`/dashboard/${organizationId}/products/categories/${grandchildPath}`}
																				className="hover:underline flex items-center truncate max-w-[220px] font-medium"
																			>
																				<span className="truncate">
																					{grandchild.name}
																				</span>
																			</Link>
																			<div className="flex items-center text-xs text-muted-foreground truncate max-w-[220px]">
																				<span className="text-xs font-medium">
																					{category.name}
																				</span>
																				<span className="mx-1">/</span>
																				<span className="text-xs font-medium">
																					{childCategory.name}
																				</span>
																				<span className="mx-1">/</span>
																				<span className="truncate">
																					{grandchild.slug}
																				</span>
																			</div>
																		</div>
																	</div>
																</TableCell>
																<TableCell
																	role="gridcell"
																	className="text-muted-foreground"
																>
																	<div className="truncate max-w-[300px]">
																		{grandchild.description || "-"}
																	</div>
																</TableCell>
																<TableCell role="gridcell">
																	<Badge
																		variant="outline"
																		className={cn(
																			"px-2 py-0 text-xs",
																			grandchildStatusOption &&
																				`bg-${grandchildStatusOption.color}/10 text-${grandchildStatusOption.color} border-${grandchildStatusOption.color}/40`,
																			grandchild.status === "ACTIVE" &&
																				"bg-green-100 text-green-700 border-green-200",
																			grandchild.status === "INACTIVE" &&
																				"bg-amber-100 text-amber-700 border-amber-200",
																			grandchild.status === "ARCHIVED" &&
																				"bg-red-100 text-red-700 border-red-200"
																		)}
																	>
																		{grandchildStatusOption?.label ||
																			grandchild.status}
																	</Badge>
																</TableCell>
																<TableCell
																	role="gridcell"
																	className="text-center"
																>
																	<div className="w-full flex justify-center">
																		<Badge
																			variant="secondary"
																			className="text-xs"
																		>
																			0
																		</Badge>
																	</div>
																</TableCell>
																<TableCell role="gridcell">
																	<div className="space-y-1">
																		<div className="flex items-center text-xs text-muted-foreground">
																			<Clock className="h-3 w-3 mr-1" />
																			<span>
																				Créé le{" "}
																				{formatDate(grandchild.createdAt)}
																			</span>
																		</div>
																		<div className="flex items-center text-xs text-muted-foreground">
																			<Clock className="h-3 w-3 mr-1" />
																			<span>
																				Modifié le{" "}
																				{formatDate(grandchild.updatedAt)}
																			</span>
																		</div>
																	</div>
																</TableCell>
																<TableCell
																	role="gridcell"
																	className="text-right"
																>
																	<div className="invisible group-hover:visible">
																		<Link
																			href={`/dashboard/${organizationId}/products/categories/${grandchildPath}/edit`}
																			className="text-xs text-primary hover:underline"
																		>
																			Éditer
																		</Link>
																	</div>
																</TableCell>
															</TableRow>
														);
													})}
											</Fragment>
										);
									})}
							</Fragment>
						);
					})}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={7} className="px-4 py-2 hover:bg-transparent">
							<div className="flex justify-between items-center">
								<div className="text-sm text-muted-foreground">
									Affichage de {rootCategories.length} catégories principales (
									{categories.length} au total)
								</div>
								{/* Ajouter pagination si nécessaire */}
							</div>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</SelectionProvider>
	);
}
