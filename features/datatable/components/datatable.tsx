"use client";

import { useSelection } from "@/features/selection/hooks/use-selection";
import { useSorting } from "@/features/sorting/hooks/use-sorting";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import PagePagination, {
	PagePaginationProps,
} from "@/features/pagination/components/page-pagination";
import SelectionToolbar from "@/features/selection/components/selection-toolbar";

export interface ColumnDef<T> {
	id: string;
	header: string | (() => React.ReactNode);
	cell: (item: T) => React.ReactNode;
	visibility?: "always" | "tablet" | "desktop";
	align?: "left" | "center" | "right";
	sortable?: boolean;
}

export interface DataTableProps<T extends { id: string }> {
	data: T[];
	columns: ColumnDef<T>[];
	selection?: {
		key: string;
		actions?: React.ReactNode;
	};
	getItemId?: (item: T) => string;
	pagination?: PagePaginationProps;
}

const cellStyles = <T,>(column: ColumnDef<T>) =>
	cn(
		"whitespace-nowrap",
		column.align === "center" && "text-center",
		column.align === "right" && "text-right"
	);

export default function DataTable<T extends { id: string }>({
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
					variant="subtle"
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
			<div className="rounded-md bg-muted/20 p-4">
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
									className={cn(cellStyles<T>(column), "")}
									onClick={() => column.sortable && sortBy(column.id)}
								>
									<div
										className={cn(
											"flex items-center gap-2",
											column.align === "right" && "justify-end",
											column.align === "center" && "justify-center"
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
											className={cellStyles<T>(column)}
										>
											{column.cell(item)}
										</TableCell>
									))}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{pagination && <PagePagination {...pagination} />}
		</div>
	);
}
