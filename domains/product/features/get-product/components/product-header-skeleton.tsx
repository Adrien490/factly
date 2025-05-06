import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProductHeaderSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-start gap-4">
				{/* Image skeleton */}
				<Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />

				<div className="flex-grow space-y-2">
					<div className="flex items-center gap-3">
						<Skeleton className="h-9 w-56" />
						<Skeleton className="h-5 w-16" />
					</div>

					<div className="flex items-center gap-3 text-sm">
						<Skeleton className="h-4 w-32" />
						<span className="text-muted-foreground/20">•</span>
						<Skeleton className="h-4 w-24" />
						<span className="text-muted-foreground/20">•</span>
						<Skeleton className="h-4 w-20" />
					</div>
				</div>
			</div>

			{/* Navigation skeleton */}
			<div className="flex space-x-2">
				<Skeleton className="h-10 w-28" />
				<Skeleton className="h-10 w-28" />
				<Skeleton className="h-10 w-28" />
				<Skeleton className="h-10 w-28" />
			</div>
		</div>
	);
}
