import {
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { getSuppliers } from "@/domains/supplier/features/get-suppliers";
import {
	SupplierDataTable,
	SupplierDataTableSkeleton,
} from "@/domains/supplier/features/get-suppliers/components";
import { RefreshSuppliersButton } from "@/domains/supplier/features/refresh-suppliers/components";
import { getSupplierNavigation } from "@/domains/supplier/utils";
import {
	Badge,
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
import { SupplierStatus, SupplierType } from "@prisma/client";
import {
	Archive,
	Briefcase,
	Calendar,
	Filter,
	Store,
	Truck,
	Undo,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
		status?: SupplierStatus | SupplierStatus[];
		supplierType?: SupplierType;
	}>;
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SuppliersPage({
	searchParams,
	params,
}: PageProps) {
	const { perPage, page, sortBy, sortOrder, search, status, supplierType } =
		await searchParams;
	const { organizationId } = await params;

	// Construire l'objet de filtres
	const filters: Record<string, string | string[]> = {};
	if (status) {
		filters.status = status;
	} else {
		// Par défaut, exclure les fournisseurs archivés
		filters.status = Object.values(SupplierStatus).filter(
			(status) => status !== SupplierStatus.ARCHIVED
		);
	}
	if (supplierType) filters.supplierType = supplierType;

	// Calculer le nombre de filtres actifs
	const activeFiltersCount = Object.keys(filters).filter((key) => {
		// Ne pas compter le filtre status par défaut (exclusion des archivés)
		if (key === "status" && !status) return false;
		// Ne pas compter le statut "archived" s'il est présent
		if (key === "status" && status === SupplierStatus.ARCHIVED) return false;
		return true;
	}).length;

	const isArchivedView = status === SupplierStatus.ARCHIVED;

	return (
		<PageContainer className="group pb-12">
			{/* En-tête avec action principale */}
			<PageHeader
				title="Fournisseurs"
				description="Gérez votre portefeuille fournisseurs"
			/>

			<HorizontalMenu items={getSupplierNavigation(organizationId)} />

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
									<RefreshSuppliersButton organizationId={organizationId} />
								</TooltipTrigger>
								<TooltipContent>
									<p>Rafraîchir la liste des fournisseurs</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				}
				rightContent={
					<>
						<SortingOptionsDropdown
							sortFields={[
								{
									label: "Nom",
									value: "name",
									icon: <Store className="h-4 w-4" />,
								},

								{
									label: "Type de fournisseur",
									value: "supplierType",
									icon: <Truck className="h-4 w-4" />,
								},
								{
									label: "Statut",
									value: "status",
									icon: <Briefcase className="h-4 w-4" />,
								},
								{
									label: "Date de création",
									value: "createdAt",
									icon: <Calendar className="h-4 w-4" />,
								},
							]}
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
									<SheetTitle>Filtrer les fournisseurs</SheetTitle>
									<SheetDescription>
										Filtrez les fournisseurs en fonction de vos besoins.
									</SheetDescription>
								</SheetHeader>

								<ScrollArea className="h-[calc(100vh-12rem)] my-4 pr-4">
									<div className="space-y-6">
										{/* Filtre par type de fournisseur */}
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<FormLabel className="text-base font-medium">
													Type de fournisseur
												</FormLabel>
											</div>

											<div className="space-y-2">
												{SUPPLIER_TYPES.map((type) => (
													<div
														key={type.value}
														className="flex items-center space-x-2"
													>
														<CheckboxFilter
															filterKey="supplierType"
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
													{SUPPLIER_STATUSES.filter(
														(status) => status.value !== SupplierStatus.ARCHIVED
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
										filters={["supplierType", "status"]}
										label="Réinitialiser les filtres"
										className="w-full"
										excludeFilters={isArchivedView ? ["status"] : []}
									/>
									<Button className="w-full">Fermer</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>

						<Button
							variant={isArchivedView ? "default" : "outline"}
							asChild
							className="shrink-0 relative w-[245px]"
						>
							<Link
								href={
									isArchivedView
										? `/dashboard/${organizationId}/suppliers?${new URLSearchParams(
												{
													perPage: (await searchParams).perPage || "10",
													sortBy: (await searchParams).sortBy || "createdAt",
													sortOrder: (await searchParams).sortOrder || "desc",
													search: (await searchParams).search || "",
												}
										  ).toString()}`
										: `/dashboard/${organizationId}/suppliers?${new URLSearchParams(
												{
													perPage: (await searchParams).perPage || "10",
													sortBy: (await searchParams).sortBy || "createdAt",
													sortOrder: (await searchParams).sortOrder || "desc",
													search: (await searchParams).search || "",
													status: SupplierStatus.ARCHIVED,
												}
										  ).toString()}`
								}
								className="flex items-center justify-center"
							>
								{isArchivedView ? (
									<>
										<Undo className="mr-2 h-4 w-4" />
										<span>Voir tous les fournisseurs</span>
									</>
								) : (
									<>
										<Archive className="mr-2 h-4 w-4" />
										<span>Voir les fournisseurs archivés</span>
									</>
								)}
							</Link>
						</Button>

						<Button className="shrink-0" asChild>
							<Link href={`/dashboard/${organizationId}/suppliers/new`}>
								Nouveau fournisseur
							</Link>
						</Button>
					</>
				}
			/>

			{/* Tableau de données */}
			<Suspense fallback={<SupplierDataTableSkeleton />}>
				<SupplierDataTable
					suppliersPromise={getSuppliers({
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
