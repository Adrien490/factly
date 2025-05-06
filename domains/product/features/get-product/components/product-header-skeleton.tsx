import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductHeaderSkeleton() {
	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
			<div className="space-y-2">
				<div className="flex items-center gap-3">
					<Skeleton className="h-9 w-56" />
					<Skeleton className="h-5 w-16" />
					<Skeleton className="h-5 w-24" />
				</div>

				<div className="flex items-center gap-3 text-sm">
					<Skeleton className="h-4 w-32" />
					<span className="text-muted-foreground/20">•</span>
					<Skeleton className="h-4 w-24" />
					<span className="text-muted-foreground/20">•</span>
					<Skeleton className="h-4 w-20" />
				</div>

				<div className="flex flex-wrap gap-3 mt-1">
					<div className="inline-flex items-center gap-1">
						<Skeleton className="h-3.5 w-3.5 rounded-full" />
						<Skeleton className="h-4 w-40" />
					</div>
					<div className="inline-flex items-center gap-1">
						<Skeleton className="h-3.5 w-3.5 rounded-full" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>

			<div className="sticky top-0 z-10 pb-2 flex-shrink-0">
				<Skeleton className="h-9 w-40" />
			</div>
		</div>
	);
}
