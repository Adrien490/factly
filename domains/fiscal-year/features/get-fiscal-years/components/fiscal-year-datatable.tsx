"use client";

import { FISCAL_YEAR_STATUS_MAP } from "@/domains/fiscal-year/constants/fiscal-year-statuses/constants";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	EmptyState,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";
import { SelectionProvider } from "@/shared/contexts";
import { cn, formatDate } from "@/shared/utils";
import {
	CalendarDays,
	Edit2,
	MoreVerticalIcon,
	Search,
	Trash,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { DeleteFiscalYearButton } from "../../delete-fiscal-year";
import { GetFiscalYearsReturn } from "../types";

export interface FiscalYearDataTableProps {
	fiscalYearsPromise: Promise<GetFiscalYearsReturn>;
	organizationId: string;
}

export function FiscalYearDataTable({
	fiscalYearsPromise,
	organizationId,
}: FiscalYearDataTableProps) {
	const fiscalYears = use(fiscalYearsPromise);

	if (fiscalYears.length === 0) {
		return (
			<EmptyState
				icon={<Search className="w-10 h-10" />}
				title="Aucune année fiscale trouvée"
				description="Aucune année fiscale n'a été trouvée. Vous pouvez en créer une nouvelle."
				className="group-has-[[data-pending]]:animate-pulse py-12"
			/>
		);
	}

	return (
		<SelectionProvider>
			<Table className="group-has-[[data-pending]]:animate-pulse">
				<TableHeader>
					<TableRow>
						<TableHead key="name" role="columnheader">
							Année fiscale
						</TableHead>
						<TableHead
							key="dates"
							role="columnheader"
							className="hidden md:table-cell"
						>
							Période
						</TableHead>
						<TableHead
							key="status"
							role="columnheader"
							className="hidden md:table-cell"
						>
							Statut
						</TableHead>
						<TableHead
							key="current"
							role="columnheader"
							className="hidden lg:table-cell"
						>
							Année en cours
						</TableHead>
						<TableHead key="actions" role="columnheader" className="">
							<></>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{fiscalYears.map((fiscalYear) => {
						const statusInfo = FISCAL_YEAR_STATUS_MAP[fiscalYear.status];
						return (
							<TableRow key={fiscalYear.id} role="row" tabIndex={0}>
								<TableCell role="gridcell">
									<div className="w-[250px] flex flex-col space-y-1">
										<div className="flex items-center gap-2">
											<div className="font-medium truncate">
												{fiscalYear.name}
											</div>
										</div>
										{fiscalYear.description && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<span className="truncate">
													{fiscalYear.description}
												</span>
											</div>
										)}
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<div className="flex items-center gap-2">
										<CalendarDays className="h-4 w-4 text-muted-foreground" />
										<div className="flex flex-col">
											<span className="text-xs">
												Du {formatDate(fiscalYear.startDate)}
											</span>
											<span className="text-xs">
												au {formatDate(fiscalYear.endDate)}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell role="gridcell" className="hidden md:table-cell">
									<Badge
										variant="outline"
										style={{
											backgroundColor: `${statusInfo?.color}20`, // Couleur avec opacity 20%
											color: statusInfo?.color,
											borderColor: `${statusInfo?.color}40`, // Couleur avec opacity 40%
										}}
									>
										{statusInfo?.label || fiscalYear.status}
									</Badge>
								</TableCell>
								<TableCell role="gridcell" className="hidden lg:table-cell">
									{fiscalYear.isCurrent ? (
										<Badge
											variant="secondary"
											className="bg-green-100 text-green-800 border-green-200"
										>
											Année courante
										</Badge>
									) : (
										<span className="text-xs text-muted-foreground">-</span>
									)}
								</TableCell>
								<TableCell role="gridcell" className="flex justify-end">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className={cn(
													"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
												)}
												aria-label="Menu d'actions"
												type="button"
											>
												<MoreVerticalIcon className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											side="bottom"
											sideOffset={4}
											className="w-48"
										>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link
													href={`/dashboard/${organizationId}/fiscal-years/${fiscalYear.id}/edit`}
													className={cn("flex w-full items-center")}
												>
													<Edit2 className="h-4 w-4 mr-2" />
													<span>Modifier</span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<DropdownMenuItem
														preventDefault
														className="text-destructive focus:text-destructive"
													>
														<Trash className="text-destructive h-4 w-4 mr-2" />
														<span>Supprimer</span>
													</DropdownMenuItem>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle className="text-destructive">
															Êtes-vous sûr de vouloir supprimer cette année
															fiscale ?
														</AlertDialogTitle>
														<AlertDialogDescription>
															Cette action est irréversible. Cela supprimera
															définitivement l&apos;année fiscale
															{fiscalYear.name && (
																<strong> {fiscalYear.name}</strong>
															)}{" "}
															et toutes ses données associées.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Annuler</AlertDialogCancel>
														<DeleteFiscalYearButton
															id={fiscalYear.id}
															organizationId={organizationId}
														>
															<AlertDialogAction>Supprimer</AlertDialogAction>
														</DeleteFiscalYearButton>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</SelectionProvider>
	);
}
