import { Skeleton, TableCell, TableRow } from "@/shared/components";

interface InvitationDataTableSkeletonProps {
	columnCount: number;
	rowCount?: number;
}

export function InvitationDataTableSkeleton({
	columnCount,
	rowCount = 10,
}: InvitationDataTableSkeletonProps) {
	return (
		<>
			{Array.from({ length: rowCount }).map((_, i) => (
				<TableRow key={i}>
					{Array.from({ length: columnCount }).map((_, i) => (
						<TableCell key={i}>
							<Skeleton className="h-6 w-full" />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}
