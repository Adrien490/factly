import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="space-y-4">
			{/* Header avec breadcrumbs et titre */}
			<div className="space-y-2">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-4 w-2" />
					<Skeleton className="h-4 w-16" />
				</div>
				<div className="space-y-1">
					<Skeleton className="h-7 w-32" />
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			{/* Barre d'outils */}
			<div className="bg-muted/50 p-4 rounded-lg">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<div className="flex flex-col sm:flex-row items-center gap-4">
						{/* Search et filtres */}
						<Skeleton className="h-9 w-full sm:w-[300px]" />
						<Skeleton className="h-9 w-24" />
					</div>
					{/* Actions */}
					<div className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
						<Skeleton className="h-9 w-[100px]" />
						<Skeleton className="h-9 w-[120px]" />
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				{/* Table header */}
				<div className="border-b bg-muted/50 p-4">
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="hidden md:block h-4 w-40" />
						<Skeleton className="hidden lg:block h-4 w-32" />
					</div>
				</div>

				{/* Table rows */}
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="border-b p-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-4 w-4" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="hidden md:block h-4 w-40" />
							<Skeleton className="hidden lg:block h-4 w-32" />
						</div>
					</div>
				))}

				{/* Pagination */}
				<div className="border-t p-4">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Skeleton className="h-8 w-[100px]" />
							<Skeleton className="h-4 w-[200px]" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-[100px]" />
							<div className="flex items-center gap-1">
								{Array.from({ length: 3 }).map((_, i) => (
									<Skeleton key={i} className="h-8 w-8" />
								))}
							</div>
							<Skeleton className="h-8 w-[100px]" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
