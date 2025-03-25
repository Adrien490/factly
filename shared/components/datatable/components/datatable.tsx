"use client";

import { useSelection } from "@/shared/components/datatable/hooks/use-selection";
import { cn } from "@/shared/lib/utils";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";

import useSorting from "@/shared/components/datatable/hooks/use-sorting";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { cellStyles } from "../constants";
import { ColumnDef } from "../types";
import { Pagination, PaginationProps } from "./pagination";
import { SelectionToolbar } from "./selection/selection-toolbar";

export interface DataTableProps<T extends { id: string }> {
	data: T[];
	columns: ColumnDef<T>[];
	selection?: {
		key: string;
		actions?: React.ReactNode;
	};
	getItemId?: (item: T) => string;
	pagination?: PaginationProps;
}

export function DataTable<T extends { id: string }>({
	data,
	columns,
	selection,
	getItemId = (item: T) => item.id,
	pagination,
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
			<div className="py-12">
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
		<div className="flex flex-col">
			<SelectionToolbar
				selectedItems={selectedItems}
				actions={selection?.actions}
			/>
			<div className="rounded-md bg-card p-4">
				<Table
					className="group-has-[[data-pending]]:animate-pulse"
					data-pending={isPending ? "" : undefined}
				>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{selection && (
								<TableHead className="w-[40px]">
									<Checkbox
										checked={areAllSelected(data.map(getItemId))}
										onCheckedChange={(checked) =>
											handleSelectionChange(
												data.map(getItemId),
												checked as boolean
											)
										}
										aria-label="Sélectionner toutes les lignes"
									/>
								</TableHead>
							)}
							{columns.map((column) => (
								<TableHead
									key={column.id}
									className={cn(cellStyles(column.visibility), "")}
									onClick={() => column.sortable && sortBy(column.id)}
								>
									<div className={cn("flex items-center gap-2")}>
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
														<ArrowUp className="h-4 w-4" />
													) : (
														<ArrowDown className="h-4 w-4" />
													)
												) : (
													<ChevronsUpDown className="h-4 w-4" />
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
								>
									{selection && (
										<TableCell className="w-[40px]">
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
											className={cellStyles(column.visibility)}
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
								<TableCell colSpan={7} className="py-4">
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
			</div>
		</div>
	);
}
