"use client";

import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import { Badge, EmptyState } from "@/shared/components";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import {
	ArrowRight,
	Edit,
	Eye,
	FileBox,
	FileText,
	Folder,
	FolderOpen,
	MoreVertical,
	Plus,
	Search,
	Tag,
	Trash,
} from "lucide-react";
import { use } from "react";
import { ProductCategoryNode } from "../data/mock-categories";

interface ProductCategoriesTreeProps {
	categoriesPromise: Promise<ProductCategoryNode[]>;
	className?: string;
}

export function ProductCategoriesTree({
	categoriesPromise,
	className,
}: ProductCategoriesTreeProps) {
	const categories = use(categoriesPromise);
	// Fonction récursive pour rendre l'arbre des catégories
	const renderCategoryTree = (items: ProductCategoryNode[], depth = 0) => {
		return (
			<Accordion type="multiple" className="w-full">
				{items.map((category) => {
					const hasChildren = category.children && category.children.length > 0;
					const statusOption = PRODUCT_CATEGORY_STATUSES.find(
						(option) => option.value === category.status
					);

					return (
						<AccordionItem
							key={category.id}
							value={category.id}
							className="border-b-0 mb-1 transition-all duration-150 hover:bg-muted/50"
						>
							<div className="flex items-center justify-between pr-2 rounded-md group">
								<AccordionTrigger className="py-2.5 px-3 hover:no-underline flex-1 gap-3 rounded-md hover:bg-muted/30">
									<div className="flex items-center gap-2.5">
										{hasChildren ? (
											<>
												<FolderOpen className="h-4 w-4 text-blue-500 data-[state=closed]:hidden" />
												<Folder className="h-4 w-4 text-blue-500 data-[state=open]:hidden" />
											</>
										) : (
											<FileBox className="h-4 w-4 text-gray-500" />
										)}
										<div className="flex flex-col space-y-1 max-w-[250px]">
											<div className="font-medium text-sm truncate">
												{category.name}
											</div>
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Tag className="h-3 w-3 shrink-0" />
												<span className="truncate">{category.slug}</span>
											</div>
										</div>

										<div className="ml-auto flex items-center gap-2">
											{category.status !== "ACTIVE" && statusOption && (
												<Badge
													variant="outline"
													style={{
														backgroundColor: `${statusOption.color}20`,
														color: statusOption.color,
														borderColor: `${statusOption.color}40`,
													}}
												>
													{statusOption.label}
												</Badge>
											)}

											{!hasChildren && (
												<span className="text-xs text-muted-foreground">
													{Math.floor(Math.random() * 50)} produits
												</span>
											)}
										</div>
									</div>
								</AccordionTrigger>

								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-md"
										title="Ajouter un produit"
									>
										<Plus className="h-4 w-4" />
									</Button>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-md"
											>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-52">
											<DropdownMenuItem>
												<Eye className="h-4 w-4 mr-2" />
												<span>Voir les détails</span>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Edit className="h-4 w-4 mr-2" />
												<span>Modifier</span>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<FileText className="h-4 w-4 mr-2" />
												<span>Voir les produits</span>
												<ArrowRight className="h-3 w-3 ml-auto" />
											</DropdownMenuItem>

											<DropdownMenuSeparator />

											{hasChildren && (
												<DropdownMenuItem>
													<Plus className="h-4 w-4 mr-2" />
													<span>Ajouter une sous-catégorie</span>
												</DropdownMenuItem>
											)}

											<DropdownMenuItem variant="destructive">
												<Trash className="h-4 w-4 mr-2" />
												<span>Supprimer</span>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>

							<AccordionContent
								className={cn("pl-8", depth > 0 ? "border-l ml-3" : "")}
							>
								{hasChildren && category.children ? (
									renderCategoryTree(category.children, depth + 1)
								) : (
									<div className="py-2 px-2 text-sm text-muted-foreground italic">
										Aucune sous-catégorie
									</div>
								)}
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
		);
	};

	if (categories.length === 0) {
		return (
			<EmptyState
				icon={<Search className="w-10 h-10" />}
				title="Aucune catégorie trouvée"
				description="Aucune catégorie n'a été trouvée. Vous pouvez en créer une nouvelle."
				className="py-12 border rounded-lg"
			/>
		);
	}

	return (
		<div className={cn("rounded-lg border overflow-hidden bg-card", className)}>
			<div className="p-4 border-b bg-muted/30">
				<h3 className="text-sm font-semibold">Catégories de produits</h3>
				<p className="text-xs text-muted-foreground mt-1">
					Organisez vos produits en catégories hiérarchiques
				</p>
			</div>

			<div className="p-3">{renderCategoryTree(categories)}</div>
		</div>
	);
}
