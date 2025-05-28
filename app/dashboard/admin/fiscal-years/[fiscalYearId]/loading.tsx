import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Calendar, Clock, FileText } from "lucide-react";

export default function FiscalYearLoading() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Colonne principale (2/3) */}
				<div className="lg:col-span-2 space-y-6">
					{/* Informations essentielles */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								<Skeleton className="h-6 w-64" />
							</CardTitle>
							<CardDescription>
								<Skeleton className="h-4 w-48" />
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											<Skeleton className="h-5 w-24" />
										</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="w-full">
													<div className="text-xs text-muted-foreground">
														<Skeleton className="h-3 w-28" />
													</div>
													<Skeleton className="h-5 w-36 mt-1" />
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="w-full">
													<div className="text-xs text-muted-foreground">
														<Skeleton className="h-3 w-24" />
													</div>
													<Skeleton className="h-5 w-36 mt-1" />
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="w-full">
													<div className="text-xs text-muted-foreground">
														<Skeleton className="h-3 w-16" />
													</div>
													<Skeleton className="h-5 w-24 mt-1" />
												</div>
											</li>
										</ul>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<h3 className="text-sm font-semibold mb-2">
											<Skeleton className="h-5 w-28" />
										</h3>
										<ul className="space-y-3">
											<li className="flex items-start gap-3">
												<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="w-full">
													<div className="text-xs text-muted-foreground">
														<Skeleton className="h-3 w-20" />
													</div>
													<Skeleton className="h-5 w-32 mt-1" />
												</div>
											</li>

											<li className="flex items-start gap-3">
												<Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
												<div className="w-full">
													<div className="text-xs text-muted-foreground">
														<Skeleton className="h-3 w-32" />
													</div>
													<Skeleton className="h-5 w-16 mt-1" />
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>

							{/* Description (optionnelle) */}
							<div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
								<div className="flex items-start gap-2">
									<FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
									<div className="w-full">
										<h3 className="text-sm font-semibold mb-1">
											<Skeleton className="h-4 w-24" />
										</h3>
										<Skeleton className="h-4 w-full mt-1" />
										<Skeleton className="h-4 w-3/4 mt-1" />
										<Skeleton className="h-4 w-2/3 mt-1" />
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Colonne latérale (1/3) */}
				<div className="space-y-6">
					{/* Statistiques simples */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								<Skeleton className="h-6 w-24" />
							</CardTitle>
							<CardDescription>
								<Skeleton className="h-4 w-40" />
							</CardDescription>
						</CardHeader>

						<CardContent>
							<div className="grid grid-cols-2 gap-4 mb-4">
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<Skeleton className="h-4 w-20 mb-1" />
									<Skeleton className="h-5 w-24" />
								</div>
								<div className="bg-muted/40 rounded-lg p-4 flex flex-col items-center justify-center">
									<Skeleton className="h-4 w-24 mb-1" />
									<Skeleton className="h-5 w-16" />
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Actions rapides */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">
								<Skeleton className="h-6 w-36" />
							</CardTitle>
						</CardHeader>

						<CardContent className="space-y-2">
							<Skeleton className="h-10 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
