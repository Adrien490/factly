import {
	Badge,
	Card,
	CardContent,
	EmptyState,
	ItemCheckbox,
	Pagination,
	SelectAllCheckbox,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { Folder } from "lucide-react";
import { use } from "react";

import { ProductCategoryActions } from "@/domains/product-category/components/product-category-actions";
import { PRODUCT_CATEGORY_STATUSES } from "@/domains/product-category/constants/product-category-statuses";
import { SelectionProvider } from "@/shared/contexts";
import { cn } from "@/shared/utils";
import { GetProductCategoriesReturn } from "../types";

export interface ProductCategoryDataTableProps {
	categoriesPromise: Promise<GetProductCategoriesReturn>;
	emptyState?: React.ReactNode;
}

export function ProductCategoryDataTable({
	categoriesPromise,
	emptyState,
}: ProductCategoryDataTableProps) {
	const response = use(categoriesPromise);
	const { categories, pagination } = response;
	const categoryIds = categories.map((category) => category.id);

	if (categories.length === 0) {
		return (
			emptyState || (
				<EmptyState
					title="Aucune catégorie trouvée"
					description="Aucune catégorie n'a été trouvée. Vous pouvez en créer une nouvelle."
				/>
			)
		);
	}

	return (
		<SelectionProvider>
			<Card>
				<CardContent>
					<Table className="group-has-[[data-pending]]:animate-pulse">
						<TableHeader>
							<TableRow>
								<TableHead
									key="select"
									role="columnheader"
									className="w-[50px]"
								>
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

								// Construction de l'URL en fonction du chemin actuel et du slug de la catégorie

								return (
									<TableRow key={category.id} role="row" tabIndex={0}>
										<TableCell role="gridcell" className="w-[50px]">
											<ItemCheckbox itemId={category.id} />
										</TableCell>
										<TableCell
											role="gridcell"
											className="font-medium w-[350px]"
										>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
													<Folder className="h-4 w-4 text-muted-foreground" />
												</div>
												<div className="min-w-0">
													<span className="truncate">{category.name}</span>
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
													category.status === "ARCHIVED" &&
														"bg-red-100 text-red-700 border-red-200"
												)}
											>
												{statusOption?.label || category.status}
											</Badge>
										</TableCell>

										<TableCell role="gridcell" className="text-right w-[100px]">
											<ProductCategoryActions category={category} />
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TableCell
									colSpan={6}
									className="px-4 py-2 hover:bg-transparent"
								>
									<Pagination
										total={pagination.total}
										pageCount={pagination.pageCount}
										page={pagination.page}
										perPage={pagination.perPage}
									/>
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</CardContent>
			</Card>
		</SelectionProvider>
	);
}
