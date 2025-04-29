import {
	CLIENT_SORT_FIELDS,
	CLIENT_STATUSES,
	CLIENT_TYPES,
	getClientNavigation,
} from "@/domains/client/constants";
import { getClients } from "@/domains/client/features/get-clients";

import {
	ClientDataTable,
	ClientDataTableSkeleton,
} from "@/domains/client/features/get-clients/components";
import { RefreshClientsButton } from "@/domains/client/features/refresh-clients/components";
import {
	Button,
	ClearFiltersButton,
	FormLabel,
	HorizontalMenu,
	Label,
	PageContainer,
	PageHeader,
	ScrollArea,
	SearchForm,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SortingOptionsDropdown,
	Toolbar,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components";
import { CheckboxFilter } from "@/shared/components/checkbox-filter";
import { SortOrder } from "@/shared/types";
import { ClientStatus, ClientType } from "@prisma/client";
import { Archive, Badge, Filter, Undo } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

// Options pour le type de client

type PageProps = {
	searchParams: Promise<{
		// Pagination
		perPage?: string;
		page?: string;
		cursor?: string;

		// Tri
		sortBy?: string;
		sortOrder?: SortOrder;

		// Recherche
		search?: string;

		// Filtres
		status?: ClientStatus | ClientStatus[];
		type?: ClientType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function ClientsPage({ searchParams, params }: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, type } =
		await searchParams;
	const { organizationId } = await params;

	// Construire l'objet de filtres
	const filters: Record<string, string | string[]> = {};
	if (status) {
		filters.status = status;
	} else {
		// Par défaut, exclure les clients archivés
		filters.status = Object.values(ClientStatus).filter(
			(status) => status !== ClientStatus.ARCHIVED
		);
	}
	if (type) filters.type = type;

	// Calculer le nombre de filtres actifs
	const activeFiltersCount = Object.keys(filters).filter((key) => {
		// Ne pas compter le filtre status par défaut (exclusion des archivés)
		if (key === "status" && !status) return false;
		// Ne pas compter le statut "archived" s'il est présent
		if (key === "status" && status === ClientStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === ClientStatus.ARCHIVED;

	return (
		<PageContainer className="group pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Clients"
				description="Gérez votre portefeuille clients"
			/>

			<HorizontalMenu items={getClientNavigation(organizationId)} />

			{/* Barre d'actions principale */}
			<Toolbar
				leftContent={
					<div className="flex items-center gap-3 flex-1">
						<SearchForm
							paramName="search"
							placeholder="Rechercher..."
							className="flex-1 shrink-0"
						/>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<RefreshClientsButton organizationId={organizationId} />
								</TooltipTrigger>
								<TooltipContent>
									<p>Rafraîchir la liste des clients</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				}
				rightContent={
					<>
						<SortingOptionsDropdown
							sortFields={CLIENT_SORT_FIELDS}
							defaultSortBy="createdAt"
							defaultSortOrder="desc"
							className="w-[200px] shrink-0"
						/>

						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" className="relative">
									<Filter className="size-4 mr-2" />
									Filtres
									{activeFiltersCount > 0 && (
										<Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium text-primary-foreground">
											{activeFiltersCount}
										</Badge>
									)}
								</Button>
							</SheetTrigger>
							<SheetContent>
								<SheetHeader>
									<SheetTitle>Filtrer les clients</SheetTitle>
									<SheetDescription>
										Filtrez les clients en fonction de vos besoins.
									</SheetDescription>
								</SheetHeader>

								<ScrollArea className="h-[calc(100vh-12rem)] my-4 pr-4">
									<div className="space-y-6">
										{/* Filtre par type de client (RadioGroup) */}
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<FormLabel className="text-base font-medium">
													Type de client
												</FormLabel>
											</div>

											<div className="space-y-2">
												{CLIENT_TYPES.map((type) => (
													<div
														key={type.value}
														className="flex items-center space-x-2"
													>
														<CheckboxFilter
															filterKey="type"
															value={type.value}
															id={`type-${type.value}`}
														/>
														<Label
															htmlFor={`type-${type.value}`}
															className="flex items-center cursor-pointer"
														>
															<span
																className="w-2 h-2 rounded-full mr-2"
																style={{ backgroundColor: type.color }}
															/>
															{type.label}
														</Label>
													</div>
												))}
											</div>
										</div>

										<Separator />

										{!isArchivedView && (
											<div className="space-y-4">
												<FormLabel className="text-base font-medium">
													Statut
												</FormLabel>
												<div className="space-y-2">
													{CLIENT_STATUSES.filter(
														(status) => status.value !== ClientStatus.ARCHIVED
													).map((status) => (
														<div
															key={status.value}
															className="flex items-center space-x-2"
														>
															<CheckboxFilter
																filterKey="status"
																value={status.value}
																id={`status-${status.value}`}
															/>
															<Label
																htmlFor={`status-${status.value}`}
																className="flex items-center cursor-pointer"
															>
																<span
																	className="w-2 h-2 rounded-full mr-2"
																	style={{ backgroundColor: status.color }}
																/>
																{status.label}
															</Label>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</ScrollArea>

								<SheetFooter className="mt-6">
									<ClearFiltersButton
										filters={["type", "status"]}
										label="Réinitialiser les filtres"
										className="w-full"
									/>
									<Button className="w-full">Fermer</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>

						<Button
							variant={isArchivedView ? "default" : "outline"}
							asChild
							className="shrink-0 relative w-[200px]"
						>
							<Link
								href={
									isArchivedView
										? `/dashboard/${organizationId}/clients`
										: `/dashboard/${organizationId}/clients?status=${ClientStatus.ARCHIVED}`
								}
								className="flex items-center justify-center"
							>
								{isArchivedView ? (
									<>
										<Undo className="mr-2 h-4 w-4" />
										<span>Voir tous les clients</span>
									</>
								) : (
									<>
										<Archive className="mr-2 h-4 w-4" />
										<span>Voir les clients archivés</span>
									</>
								)}
							</Link>
						</Button>

						<Button className="shrink-0" asChild>
							<Link href={`/dashboard/${organizationId}/clients/new`}>
								Nouveau client
							</Link>
						</Button>
					</>
				}
			/>

			{/* Tableau de données */}
			<Suspense fallback={<ClientDataTableSkeleton />}>
				<ClientDataTable
					clientsPromise={getClients({
						organizationId,
						perPage: Number(perPage) || 10,
						page: Number(page) || 1,
						sortBy: sortBy as string,
						sortOrder: sortOrder as SortOrder,
						search,
						filters,
					})}
				/>
			</Suspense>
		</PageContainer>
	);
}
