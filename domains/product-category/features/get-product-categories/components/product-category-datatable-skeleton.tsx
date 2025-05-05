"use client";

import {
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { Fragment } from "react";

export function ProductCategoryDataTableSkeleton() {
	// Calculer le nombre de colonnes pour le colSpan
	const columnCount = 6;

	return (
		<div className="animate-pulse">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead key="select" role="columnheader">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-4 rounded" />
							</div>
						</TableHead>
						<TableHead key="name" role="columnheader" className="w-[300px]">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-16 rounded" />
							</div>
						</TableHead>
						<TableHead key="description" role="columnheader">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-24 rounded" />
							</div>
						</TableHead>
						<TableHead key="status" role="columnheader" className="w-[150px]">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-14 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="products"
							role="columnheader"
							className="w-[100px] text-center"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-16 rounded mx-auto" />
							</div>
						</TableHead>
						<TableHead
							key="actions"
							role="columnheader"
							className="w-[100px] text-right"
						>
							<div className="flex-1 font-medium"></div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* Catégories racines avec enfants */}
					{Array.from({ length: 3 }).map((_, parentIndex) => (
						<Fragment key={`parent-group-${parentIndex}`}>
							{/* Catégorie parent */}
							<TableRow key={`parent-${parentIndex}`} role="row">
								<TableCell role="gridcell">
									<Skeleton className="h-4 w-4 rounded" />
								</TableCell>
								<TableCell role="gridcell">
									<div className="flex items-center gap-2">
										<Skeleton className="h-8 w-8 rounded-md" />
										<div className="w-[180px] flex flex-col space-y-1">
											<Skeleton className="h-5 w-32 rounded" />
											<Skeleton className="h-3 w-20 rounded" />
										</div>
									</div>
								</TableCell>
								<TableCell role="gridcell">
									<Skeleton className="h-4 w-40 rounded" />
								</TableCell>
								<TableCell role="gridcell">
									<Skeleton className="h-6 w-20 rounded-full" />
								</TableCell>
								<TableCell role="gridcell" className="text-center">
									<Skeleton className="h-4 w-4 rounded mx-auto" />
								</TableCell>
								<TableCell role="gridcell" className="text-right">
									<div className="flex justify-end">
										<Skeleton className="h-8 w-8 rounded" />
									</div>
								</TableCell>
							</TableRow>

							{/* Sous-catégories */}
							{Array.from({ length: 2 }).map((_, childIndex) => (
								<TableRow key={`child-${parentIndex}-${childIndex}`} role="row">
									<TableCell role="gridcell">
										<Skeleton className="h-4 w-4 rounded" />
									</TableCell>
									<TableCell role="gridcell">
										<div className="flex items-center gap-2 ml-8">
											<Skeleton className="h-4 w-4 rounded" />
											<Skeleton className="h-8 w-8 rounded-md" />
											<div className="w-[160px] flex flex-col space-y-1">
												<Skeleton className="h-5 w-28 rounded" />
												<Skeleton className="h-3 w-24 rounded" />
											</div>
										</div>
									</TableCell>
									<TableCell role="gridcell">
										<Skeleton className="h-4 w-36 rounded" />
									</TableCell>
									<TableCell role="gridcell">
										<Skeleton className="h-6 w-20 rounded-full" />
									</TableCell>
									<TableCell role="gridcell" className="text-center">
										<Skeleton className="h-4 w-4 rounded mx-auto" />
									</TableCell>
									<TableCell role="gridcell" className="text-right">
										<div className="flex justify-end">
											<Skeleton className="h-8 w-8 rounded" />
										</div>
									</TableCell>
								</TableRow>
							))}
						</Fragment>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={columnCount}
							className="px-4 py-2 hover:bg-transparent"
						>
							<div className="flex justify-between items-center">
								<Skeleton className="h-5 w-56 rounded" />
								<div className="flex gap-1">
									<Skeleton className="h-8 w-8 rounded" />
									<Skeleton className="h-8 w-8 rounded" />
									<Skeleton className="h-8 w-8 rounded" />
								</div>
							</div>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
