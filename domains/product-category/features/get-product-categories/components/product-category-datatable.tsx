"use client";

import { Badge, EmptyState } from "@/shared/components";
import { Folder, FolderOpen, Search } from "lucide-react";
import { use } from "react";

import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { ProductCategoryTree } from "../types";

export interface ProductCategoryDataTableProps {
	categoriesPromise: Promise<ProductCategoryTree[]>;
	organizationId: string;
}

export function ProductCategoryDataTable({
	categoriesPromise,
	organizationId,
}: ProductCategoryDataTableProps) {
	const categories = use(categoriesPromise) as ProductCategoryTree[];

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

	// Fonction récursive pour rendre l'arborescence à la volée
	const renderCategoryTree = (items: ProductCategoryTree[]) => {
		return items.map((category) => {
			const statusOption = PRODUCT_CATEGORY_STATUSES.find(
				(option) => option.value === category.status
			);
			const hasChildren = category.children && category.children.length > 0;

			return (
				<AccordionItem
					key={category.id}
					value={category.id}
					className="border-b border-b-muted/50"
				>
					<AccordionTrigger disabled={!hasChildren}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
									<FolderOpen className="h-4 w-4 text-blue-500 data-[state=closed]:hidden" />
									<Folder className="h-4 w-4 text-muted-foreground data-[state=open]:hidden" />
								</div>
								<div className="flex flex-col">
									<Link
										href={`/dashboard/${organizationId}/categories/${category.slug}`}
										className="hover:underline font-medium text-sm flex items-center truncate max-w-[220px]"
										onClick={(e) => e.stopPropagation()}
									>
										<span className="truncate">{category.name}</span>
									</Link>
									<span className="text-xs text-muted-foreground truncate block max-w-[220px]">
										/{category.slug}
									</span>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="hidden md:block max-w-[300px] truncate text-muted-foreground text-sm">
									{category.description || "-"}
								</div>
								<Badge
									variant="outline"
									className={cn(
										"px-2 py-0 text-xs ml-auto hidden sm:flex",
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
								<div className="text-xs text-muted-foreground hidden lg:flex items-center">
									<span className="ml-2">
										{category.childCount || 0} sous-catégories
									</span>
								</div>
							</div>
						</div>
					</AccordionTrigger>
					{hasChildren && (
						<AccordionContent className="pl-8 pt-1 pb-0">
							<Accordion type="multiple" className="w-full">
								{renderCategoryTree(category.children || [])}
							</Accordion>
						</AccordionContent>
					)}
				</AccordionItem>
			);
		});
	};

	return (
		<div className="border rounded-md">
			<Accordion type="multiple" className="w-full">
				{renderCategoryTree(categories)}
			</Accordion>
		</div>
	);
}
