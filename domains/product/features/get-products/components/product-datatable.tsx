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
import { Box, ImageIcon, Tag } from "lucide-react";
import { use } from "react";

import {
	PRODUCT_STATUS_OPTIONS,
	VAT_RATE_COLORS,
	VAT_RATE_LABELS,
} from "@/domains/product/constants";
import { formatPrice } from "@/shared/utils";
import { ProductStatus } from "@prisma/client";
import Image from "next/image";
import { ArchivedProductActions } from "../../../components/archived-product-actions";
import { ProductActions } from "../../../components/product-actions";
import { GetProductsReturn } from "../types";

export interface ProductDataTableProps {
	productsPromise: Promise<GetProductsReturn>;
}

export function ProductDataTable({ productsPromise }: ProductDataTableProps) {
	const response = use(productsPromise);
	const { products, pagination } = response;
	const productIds = products.map((product) => product.id);

	if (products.length === 0) {
		return (
			<EmptyState
				title="Aucun produit trouvé"
				description="Aucun produit n'a été trouvé. Vous pouvez en créer un nouveau."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<Card>
			<CardContent>
				<Table className="group-has-[[data-pending]]:animate-pulse">
					<TableHeader>
						<TableRow>
							<TableHead key="select" role="columnheader">
								<SelectAllCheckbox itemIds={productIds} />
							</TableHead>
							<TableHead key="product" role="columnheader">
								Produit
							</TableHead>
							<TableHead
								key="price"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Prix
							</TableHead>
							<TableHead
								key="vatRate"
								role="columnheader"
								className="hidden lg:table-cell"
							>
								TVA
							</TableHead>
							<TableHead
								key="status"
								role="columnheader"
								className="hidden md:table-cell"
							>
								Statut
							</TableHead>
							<TableHead
								key="category"
								role="columnheader"
								className="hidden lg:table-cell"
							>
								Catégorie
							</TableHead>
							<TableHead key="actions" role="columnheader" className="">
								<></>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product) => {
							const isArchived = product.status === ProductStatus.ARCHIVED;
							const statusInfo = PRODUCT_STATUS_OPTIONS.find(
								(status) => status.value === product.status
							);

							return (
								<TableRow key={product.id} role="row" tabIndex={0}>
									<TableCell role="gridcell">
										<ItemCheckbox itemId={product.id} />
									</TableCell>
									<TableCell role="gridcell">
										<div className="flex items-start gap-3">
											{product.imageUrl ? (
												<div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0">
													<Image
														src={product.imageUrl}
														alt={product.name}
														fill
														sizes="48px"
														className="object-cover"
													/>
												</div>
											) : (
												<div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0">
													<ImageIcon className="h-6 w-6 text-muted-foreground" />
												</div>
											)}
											<div className="flex flex-col space-y-1 w-[200px]">
												<div className="font-medium truncate">
													{product.name}
												</div>
												<div className="flex flex-col gap-1">
													{product.reference && (
														<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
															<Tag className="h-3 w-3 shrink-0" />
															<span className="truncate">
																{product.reference}
															</span>
														</div>
													)}
													{product.supplier && (
														<span className="text-xs text-muted-foreground truncate">
															{product.supplier.reference}
														</span>
													)}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell
										role="gridcell"
										className="hidden md:table-cell font-medium"
									>
										{formatPrice(product.price)}
									</TableCell>
									<TableCell role="gridcell" className="hidden lg:table-cell">
										<Badge
											variant="outline"
											style={{
												backgroundColor: `${
													VAT_RATE_COLORS[product.vatRate]
												}20`, // Couleur avec opacity 20%
												color: VAT_RATE_COLORS[product.vatRate],
												borderColor: `${VAT_RATE_COLORS[product.vatRate]}40`, // Couleur avec opacity 40%
											}}
										>
											{VAT_RATE_LABELS[product.vatRate]}
										</Badge>
									</TableCell>
									<TableCell role="gridcell" className="hidden md:table-cell">
										{statusInfo && (
											<Badge
												variant="outline"
												style={{
													backgroundColor: `${statusInfo.color}20`, // Couleur avec opacity 20%
													color: statusInfo.color,
													borderColor: `${statusInfo.color}40`, // Couleur avec opacity 40%
												}}
											>
												{statusInfo.label}
											</Badge>
										)}
									</TableCell>
									<TableCell role="gridcell" className="hidden lg:table-cell">
										{product.category ? (
											<div className="flex items-center gap-1.5">
												<Box className="h-3 w-3 text-muted-foreground" />
												<span className="truncate">
													{product.category.name}
												</span>
											</div>
										) : (
											<span className="text-xs text-muted-foreground italic">
												Non catégorisé
											</span>
										)}
									</TableCell>
									<TableCell role="gridcell" className="flex justify-end">
										{isArchived ? (
											<ArchivedProductActions product={product} />
										) : (
											<ProductActions product={product} />
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={7} className="px-4 py-2 hover:bg-transparent">
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
	);
}
