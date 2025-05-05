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
import { Folder, Search } from "lucide-react";
import { use } from "react";

import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import { SelectionProvider } from "@/shared/contexts";
import { cn } from "@/shared/utils";
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

	console.log("tree", categories);

	// Récupérer les catégories du niveau courant et les IDs pour la sélection
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
						<TableHead key="select" role="columnheader" className="w-[50px]">
							<SelectAllCheckbox itemIds={categoryIds} />
						</TableHead>
						<TableHead key="name" role="columnheader" className="w-[350px]">
							Nom
						</TableHead>
						<TableHead
							key="description"
							role="columnheader"
							className="w-[400px] hidden md:table-cell"
						>
							Description
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="w-[150px] hidden sm:table-cell"
						>
							Statut
						</TableHead>
						<TableHead
							key="children"
							role="columnheader"
							className="w-[150px] text-center hidden lg:table-cell"
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
					{categories.map((category) => {
						const statusOption = PRODUCT_CATEGORY_STATUSES.find(
							(option) => option.value === category.status
						);

						return (
							<TableRow key={category.id} role="row" tabIndex={0}>
								<TableCell role="gridcell" className="w-[50px]">
									<ItemCheckbox itemId={category.id} />
								</TableCell>
								<TableCell role="gridcell" className="font-medium w-[350px]">
									<div className="flex items-center gap-2">
										<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
											<Folder className="h-4 w-4 text-muted-foreground" />
										</div>
										<div className="min-w-0">
											<Link
												href={`/dashboard/${organizationId}/categories/${category.slug}`}
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
								<TableCell
									role="gridcell"
									className="text-muted-foreground w-[400px] hidden md:table-cell"
								>
									<div className="truncate max-w-[300px]">
										{category.description || "-"}
									</div>
								</TableCell>
								<TableCell
									role="gridcell"
									className="w-[150px] hidden sm:table-cell"
								>
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
								<TableCell
									role="gridcell"
									className="text-center w-[150px] hidden lg:table-cell"
								>
									{category.childCount || 0}
								</TableCell>
								<TableCell
									role="gridcell"
									className="text-right w-[100px]"
								></TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</SelectionProvider>
	);
}
