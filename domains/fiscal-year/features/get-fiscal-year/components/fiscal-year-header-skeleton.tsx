import { Skeleton } from "@/shared/components/ui";

export function FiscalYearHeaderSkeleton() {
	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<Skeleton className="h-9 w-64" />
						<div className="flex items-center gap-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-5 w-24" />
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-5 w-32" />
					</div>
				</div>

				{/* Navigation */}
				<div className="flex flex-wrap gap-3">
					<Skeleton className="h-10 w-80" />
				</div>
			</div>
		</div>
	);
}
