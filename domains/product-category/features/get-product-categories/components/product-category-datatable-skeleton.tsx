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

export function ProductCategoryDataTableSkeleton() {
	// Calculer le nombre de colonnes pour le colSpan
	const columnCount = 6;

	return (
		<div className="animate-pulse">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead key="select" role="columnheader" className="w-[50px]">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-4 rounded" />
							</div>
						</TableHead>
						<TableHead key="name" role="columnheader" className="w-[350px]">
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-16 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="description"
							role="columnheader"
							className="w-[400px] hidden md:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-20 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="w-[150px] hidden sm:table-cell"
						>
							<div className="flex-1 font-medium">
								<Skeleton className="h-4 w-14 rounded" />
							</div>
						</TableHead>
						<TableHead
							key="children"
							role="columnheader"
							className="w-[150px] text-center hidden lg:table-cell"
						>
							<div className="flex-1 font-medium text-center">
								<Skeleton className="h-4 w-28 mx-auto rounded" />
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
					{Array.from({ length: 5 }).map((_, index) => (
						<TableRow key={index} role="row">
							<TableCell role="gridcell" className="w-[50px]">
								<Skeleton className="h-4 w-4 rounded" />
							</TableCell>
							<TableCell role="gridcell" className="font-medium w-[350px]">
								<div className="flex items-center gap-2">
									<Skeleton className="h-8 w-8 rounded-md" />
									<div className="min-w-0">
										<Skeleton className="h-5 w-40 rounded" />
									</div>
								</div>
							</TableCell>
							<TableCell
								role="gridcell"
								className="text-muted-foreground w-[400px] hidden md:table-cell"
							>
								<div className="truncate max-w-[300px]">
									<Skeleton className="h-4 w-64 rounded" />
								</div>
							</TableCell>
							<TableCell
								role="gridcell"
								className="w-[150px] hidden sm:table-cell"
							>
								<Skeleton className="h-6 w-20 rounded-full" />
							</TableCell>
							<TableCell
								role="gridcell"
								className="text-center w-[150px] hidden lg:table-cell"
							>
								<Skeleton className="h-4 w-8 mx-auto rounded" />
							</TableCell>
							<TableCell role="gridcell" className="text-right w-[100px]">
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
