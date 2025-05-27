import {
	Card,
	CardContent,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";

export function MemberDataTableSkeleton() {
	return (
		<Card>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-4 w-4" />
							</TableHead>
							<TableHead>Utilisateur</TableHead>
							<TableHead className="hidden md:table-cell">Email</TableHead>
							<TableHead className="hidden md:table-cell">
								Email vérifié
							</TableHead>
							<TableHead className="hidden lg:table-cell">
								Membre depuis
							</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-4" />
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Skeleton className="h-8 w-8 rounded-full" />
										<Skeleton className="h-4 w-32" />
									</div>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-4 w-48" />
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<Skeleton className="h-6 w-20" />
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									<Skeleton className="h-4 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-8" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
