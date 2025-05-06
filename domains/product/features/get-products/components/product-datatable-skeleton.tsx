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

export function ProductDataTableSkeleton() {
	// Calculer le nombre de colonnes pour le colSpan
	const columnCount = 8;

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
						<TableHead key="product" role="columnheader">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-16 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="reference"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-20 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="price"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-12 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="vatRate"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-10 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="hidden md:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-14 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="category"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-20 rounded" />
							</div>
						</TableHead>
						<TableHead key="actions" role="columnheader" className="">
							<div className="flex-1 font-medium"></div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, index) => (
						<TableRow key={index} role="row">
							<TableCell role="gridcell">
								<Skeleton className="h-4 w-4 rounded" />
							</TableCell>
							<TableCell role="gridcell">
								<div className="flex items-center gap-2">
									<Skeleton className="h-10 w-10 rounded-md" />
									<div className="flex flex-col gap-1">
										<Skeleton className="h-5 w-32 rounded" />
										<Skeleton className="h-3 w-24 rounded" />
									</div>
								</div>
							</TableCell>
							<TableCell role="gridcell" className="hidden md:table-cell">
								<div className="flex items-center gap-1.5">
									<Skeleton className="h-3 w-3 rounded" />
									<Skeleton className="h-4 w-20 rounded" />
								</div>
							</TableCell>
							<TableCell role="gridcell" className="hidden md:table-cell">
								<Skeleton className="h-5 w-20 rounded" />
							</TableCell>
							<TableCell role="gridcell" className="hidden lg:table-cell">
								<Skeleton className="h-6 w-28 rounded-full" />
							</TableCell>
							<TableCell role="gridcell" className="hidden md:table-cell">
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
							<TableCell role="gridcell" className="hidden lg:table-cell">
								<div className="flex items-center gap-1.5">
									<Skeleton className="h-3 w-3 rounded" />
									<Skeleton className="h-4 w-24 rounded" />
								</div>
							</TableCell>
							<TableCell role="gridcell" className="">
								<div className="flex justify-end">
									<Skeleton className="h-8 w-8 rounded" />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={columnCount}
							className="px-4 py-2 hover:bg-transparent"
						>
							<div className="flex justify-between items-center">
								<Skeleton className="h-8 w-20 rounded" />
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
