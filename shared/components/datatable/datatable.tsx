"use client";

import { useSelection } from "@/shared/components/datatable/hooks/use-selection";
import { EmptyState } from "@/shared/components/empty-state";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { useSorting } from "@/shared/hooks/use-sorting";
import { cn } from "@/shared/utils";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";

import { Pagination } from "./components/pagination";
import { SelectionToolbar } from "./components/selection-toolbar";
import { cellStyles } from "./constants";
import { DataTableProps } from "./types";

export function DataTable<T extends { id: string }>({
	data,
	columns,
	selection,
	getItemId = (item: T) => item.id,
	pagination,
	ariaLabel = "Tableau de données",
}: DataTableProps<T>) {
	const {
		handleSelectionChange,
		handleItemSelectionChange,
		isSelected,
		areAllSelected,
		selectedItems,
	} = useSelection(selection?.key);

	const {
		sortBy,
		isSortedBy,
		getSortDirection,
		isPending: isSortPending,
	} = useSorting();

	const isPending = isSortPending;

	if (data.length === 0) {
		return (
			<div className="py-12" role="status" aria-live="polite">
				<EmptyState
					icon={Search}
					title="Aucune donnée trouvée"
					description="Aucune donnée ne correspond à vos critères de recherche."
					className="group-has-[[data-pending]]:animate-pulse"
				/>
			</div>
		);
	}

	return (
		<Table
			className="group-has-[[data-pending]]:animate-pulse"
			data-pending={isPending ? "" : undefined}
			aria-label={ariaLabel}
			role="grid"
		>
			<TableHeader>
				<TableRow>
					<TableCell colSpan={columns.length + (selection ? 1 : 0)}>
						<SelectionToolbar
							selectedItems={selectedItems}
							actions={selection?.actions}
						/>
					</TableCell>
				</TableRow>
				<TableRow role="row">
					{selection && (
						<TableHead className="w-[40px]" role="columnheader">
							<Checkbox
								checked={areAllSelected(data.map(getItemId))}
								onCheckedChange={(checked) =>
									handleSelectionChange(data.map(getItemId), checked as boolean)
								}
								aria-label="Sélectionner toutes les lignes"
							/>
						</TableHead>
					)}
					{columns.map((column) => (
						<TableHead
							key={column.id}
							className={cn(
								cellStyles(column.visibility),
								column.className,
								column.sortable && "cursor-pointer",
								column.align === "center" && "text-center",
								column.align === "right" && "text-right"
							)}
							onClick={() => column.sortable && sortBy(column.id)}
							tabIndex={column.sortable ? 0 : undefined}
							onKeyDown={(e) => {
								if (column.sortable && (e.key === "Enter" || e.key === " ")) {
									e.preventDefault();
									sortBy(column.id);
								}
							}}
							role="columnheader"
							aria-sort={
								isSortedBy(column.id)
									? getSortDirection(column.id) === "asc"
										? "ascending"
										: "descending"
									: undefined
							}
						>
							<div
								className={cn(
									"flex items-center gap-2",
									column.align === "center" && "justify-center",
									column.align === "right" && "justify-end"
								)}
							>
								<span className="flex-1 font-medium">
									{typeof column.header === "function"
										? column.header()
										: column.header}
								</span>
								{column.sortable && (
									<div
										className={cn(
											"shrink-0 transition-colors",
											isSortedBy(column.id)
												? "text-foreground"
												: "text-muted-foreground/50 group-hover/column:text-accent-foreground/70"
										)}
									>
										{isSortedBy(column.id) ? (
											getSortDirection(column.id) === "asc" ? (
												<ArrowUp className="h-4 w-4" aria-hidden="true" />
											) : (
												<ArrowDown className="h-4 w-4" aria-hidden="true" />
											)
										) : (
											<ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
										)}
									</div>
								)}
							</div>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((item) => {
					const id = getItemId(item);

					return (
						<TableRow
							key={id}
							className={cn(isSelected(id) ? "bg-muted/50" : undefined)}
							data-state={isSelected(id) ? "selected" : undefined}
							role="row"
							tabIndex={0}
						>
							{selection && (
								<TableCell
									className="w-[40px]"
									role="gridcell"
									onClick={(e) => {
										// Empêcher la propagation du clic vers la ligne pour les cellules de sélection
										e.stopPropagation();
									}}
								>
									<Checkbox
										checked={isSelected(id)}
										onCheckedChange={(checked) =>
											handleItemSelectionChange(id, checked as boolean)
										}
										aria-label={`Sélectionner la ligne ${id}`}
									/>
								</TableCell>
							)}
							{columns.map((column) => (
								<TableCell
									key={`${id}-${column.id}`}
									className={cn(
										cellStyles(column.visibility),
										column.className,
										column.align === "center" && "text-center",
										column.align === "right" && "text-right"
									)}
									role="gridcell"
								>
									{column.cell(item)}
								</TableCell>
							))}
						</TableRow>
					);
				})}
			</TableBody>
			{pagination && (
				<TableFooter>
					<TableRow>
						<TableCell
							colSpan={columns.length + (selection ? 1 : 0)}
							className="py-4"
						>
							<Pagination
								total={pagination.total}
								pageCount={pagination.pageCount}
								page={pagination.page}
								perPage={pagination.perPage}
							/>
						</TableCell>
					</TableRow>
				</TableFooter>
			)}
		</Table>
	);
}
