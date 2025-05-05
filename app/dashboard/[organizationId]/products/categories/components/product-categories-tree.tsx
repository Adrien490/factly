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
	ChevronRight,
	Edit,
	Eye,
	FileText,
	Folder,
	FolderIcon,
	FolderOpen,
	MoreVertical,
	Plus,
	Search,
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
							className="border-0 mb-1 rounded-md overflow-hidden"
						>
							<div className="group relative w-full hover:bg-muted/50 rounded-md">
								<div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 rounded-full hover:bg-background"
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
												<ChevronRight className="h-3.5 w-3.5 ml-auto opacity-70" />
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

								<AccordionTrigger className="py-2.5 pl-3 pr-10 hover:no-underline flex-1 rounded-md data-[state=open]:bg-muted/50 w-full">
									<div className="flex items-center w-full gap-3">
										<div className="flex-shrink-0">
											{hasChildren ? (
												<div className="relative w-5 h-5 flex items-center justify-center">
													<FolderOpen className="h-[18px] w-[18px] text-blue-500 data-[state=closed]:hidden absolute" />
													<Folder className="h-[18px] w-[18px] text-blue-500 data-[state=open]:hidden absolute" />
												</div>
											) : (
												<FolderIcon className="h-[18px] w-[18px] text-muted-foreground/70" />
											)}
										</div>

										<div className="flex-grow min-w-0">
											<div className="font-medium text-sm truncate">
												{category.name}
											</div>
											<div className="text-xs text-muted-foreground truncate">
												{category.slug}
											</div>
										</div>

										{statusOption && (
											<Badge
												variant="outline"
												className="ml-auto flex-shrink-0"
												style={{
													backgroundColor: `${statusOption.color}20`,
													color: statusOption.color,
													borderColor: `${statusOption.color}40`,
												}}
											>
												{statusOption.label}
											</Badge>
										)}
									</div>
								</AccordionTrigger>
							</div>

							{hasChildren && (
								<AccordionContent
									className={cn(
										"pl-8",
										depth > 0 && "border-l-2 border-border/50 ml-3 pt-1"
									)}
								>
									{category.children &&
										renderCategoryTree(category.children, depth + 1)}
								</AccordionContent>
							)}
						</AccordionItem>
					);
				})}
			</Accordion>
		);
	};

	if (!categories || categories.length === 0) {
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
		<div className={cn("overflow-hidden", className)}>
			<div className="space-y-0.5">{renderCategoryTree(categories)}</div>
		</div>
	);
}
