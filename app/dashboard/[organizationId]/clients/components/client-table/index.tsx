"use client";

import { clientStatuses } from "@/features/clients/constants/client-statuses";
import { clientTypes } from "@/features/clients/constants/client-types";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { getCellStyles, getHeaderStyles } from "@/shared/constants";
import { useSelection } from "@/shared/hooks/use-selection";
import useSorting from "@/shared/hooks/use-sorting";
import { cn } from "@/shared/lib/utils";
import {
	ArrowDown,
	ArrowUp,
	BuildingIcon,
	ChevronsUpDown,
	CircleDot,
	MapPin,
	Receipt,
	Tag,
} from "lucide-react";
import { use } from "react";
import RowActions from "../row-actions";
import { STATUS_VARIANTS } from "./constants";
import { ClientListProps } from "./types";

// Mapping des variants de Badge pour les statuts client

export function ClientTable({ clientsPromise }: ClientListProps) {
	const response = use(clientsPromise);
	const clients = response.clients;

	const {
		isPending: isSelectionPending,
		handleSelectionChange,
		handleItemSelectionChange,
		isSelected,
		areAllSelected,
	} = useSelection("client");

	console.log(isSelectionPending);

	const {
		sortBy,
		isSortedBy,
		getSortDirection,
		isPending: isSortPending,
	} = useSorting();

	// Helper pour le rendu de l'indicateur de tri
	const renderSortIndicator = (columnId: string) => {
		if (!isSortedBy(columnId)) return <ChevronsUpDown className="h-4 w-4" />;
		return getSortDirection(columnId) === "asc" ? (
			<ArrowUp className="h-4 w-4" />
		) : (
			<ArrowDown className="h-4 w-4" />
		);
	};

	const clientIds = clients.map((client) => client.id);
	const allSelected = areAllSelected(clientIds);

	return (
		<div className="rounded-md bg-card p-4">
			<Table
				className="group-has-[[data-pending]]:animate-pulse"
				data-pending={isSortPending ? "" : undefined}
			>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{/* Checkbox pour sélectionner tous les clients */}
						<TableHead className="w-12">
							<Checkbox
								checked={allSelected}
								onCheckedChange={(checked) =>
									handleSelectionChange(clientIds, !!checked)
								}
								aria-label="Sélectionner tous les clients"
							/>
						</TableHead>
						{/* En-tête Client */}
						<TableHead
							className={getHeaderStyles()}
							onClick={() => sortBy("name")}
						>
							<div className="flex items-center gap-2">
								<span className="flex-1 font-medium">Client</span>
								<div
									className={cn(
										"shrink-0 transition-colors",
										isSortedBy("name")
											? "text-foreground"
											: "text-muted-foreground/50 group-hover/column:text-accent-foreground/70"
									)}
								>
									{renderSortIndicator("name")}
								</div>
							</div>
						</TableHead>

						{/* En-tête Type */}
						<TableHead className={getHeaderStyles("tablet")}>
							<span className="font-medium">Type</span>
						</TableHead>

						{/* En-tête Statut */}
						<TableHead
							className={getHeaderStyles("tablet")}
							onClick={() => sortBy("status")}
						>
							<div className="flex items-center gap-2">
								<span className="flex-1 font-medium">Statut</span>
								<div
									className={cn(
										"shrink-0 transition-colors",
										isSortedBy("status")
											? "text-foreground"
											: "text-muted-foreground/50 group-hover/column:text-accent-foreground/70"
									)}
								>
									{renderSortIndicator("status")}
								</div>
							</div>
						</TableHead>

						{/* En-tête Infos fiscales */}
						<TableHead className={getHeaderStyles("desktop")}>
							<span className="font-medium">Infos fiscales</span>
						</TableHead>

						{/* En-tête Adresse */}
						<TableHead className={getHeaderStyles("desktop")}>
							<span className="font-medium">Adresse</span>
						</TableHead>

						{/* En-tête Actions */}
						<TableHead className={cn(getHeaderStyles(), "text-right")}>
							<span className="font-medium"></span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.map((client) => {
						const id = client.id;
						return (
							<TableRow
								key={id}
								className={cn(isSelected(id) ? "bg-muted/50" : undefined)}
							>
								{/* Checkbox pour sélectionner un client */}
								<TableCell className="w-12">
									<Checkbox
										checked={isSelected(id)}
										onCheckedChange={(checked) =>
											handleItemSelectionChange(id, !!checked)
										}
										aria-label={`Sélectionner ${client.name}`}
									/>
								</TableCell>
								{/* Cellule Client */}
								<TableCell className={getCellStyles()}>
									<div className="w-[200px] flex flex-col space-y-1">
										<div className="flex items-center gap-2">
											<div className="font-medium truncate">{client.name}</div>
										</div>
										{client.reference && (
											<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
												<Tag className="h-3 w-3 shrink-0" />
												<span>{client.reference}</span>
											</div>
										)}
									</div>
								</TableCell>

								{/* Cellule Type */}
								<TableCell className={getCellStyles("tablet")}>
									<div className="flex items-center gap-2">
										<BuildingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
										<span>
											{
												clientTypes.find(
													(option) => option.value === client.clientType
												)?.label
											}
										</span>
									</div>
								</TableCell>

								{/* Cellule Statut */}
								<TableCell className={getCellStyles("tablet")}>
									<div>
										<Badge
											variant={STATUS_VARIANTS[client.status] || "outline"}
										>
											{
												clientStatuses.find(
													(option) => option.value === client.status
												)?.label
											}
										</Badge>
									</div>
								</TableCell>

								{/* Cellule Infos fiscales */}
								<TableCell className={getCellStyles("desktop")}>
									<div className="flex flex-col space-y-1 max-w-[150px]">
										{client.siret && (
											<div className="flex items-center gap-1.5 text-xs">
												<Receipt className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{client.siret}</span>
											</div>
										)}
										{client.vatNumber && (
											<div className="flex items-center gap-1.5 text-xs">
												<CircleDot className="h-3 w-3 shrink-0 text-muted-foreground" />
												<span className="truncate">{client.vatNumber}</span>
											</div>
										)}
										{!client.siret && !client.vatNumber && (
											<span className="text-xs text-muted-foreground italic">
												Non renseignées
											</span>
										)}
									</div>
								</TableCell>

								{/* Cellule Adresse */}
								<TableCell className={getCellStyles("desktop")}>
									<div className="flex items-center gap-2 max-w-[200px]">
										<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
										{client.addresses &&
										client.addresses.length > 0 &&
										client.addresses.find((addr) => addr.isDefault) ? (
											<span className="truncate">
												{[
													client.addresses.find((addr) => addr.isDefault)
														?.addressLine1,
													client.addresses.find((addr) => addr.isDefault)
														?.postalCode,
													client.addresses.find((addr) => addr.isDefault)?.city,
												]
													.filter(Boolean)
													.join(", ")}
											</span>
										) : (
											<span className="text-muted-foreground italic">
												Non renseignée
											</span>
										)}
									</div>
								</TableCell>

								{/* Cellule Actions */}
								<TableCell className={getCellStyles(undefined, "right")}>
									<div className="flex justify-end">
										<RowActions client={client} />
									</div>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
