"use client";

import { useSelection } from "@/hooks/use-selection";
import { useSorting } from "@/hooks/use-sorting";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronsUpDown, SearchX } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import PagePagination from "./page-pagination";
import SelectionToolbar from "./selection-toolbar";

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
	pagination?: {
		total: number;
		pageCount: number;
		page: number;
		perPage: number;
	};
}

const cellStyles = <T,>(column: ColumnDef<T>) =>
	cn(
		"whitespace-nowrap",
		column.visibility === "tablet" && "hidden md:table-cell",
		column.visibility === "desktop" && "hidden lg:table-cell",
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
		handleSortingChange,
		isSortedBy,
		getSortOrder,
		isPending: isSortPending,
	} = useSorting();

	const isPending = isSortPending;

	if (data.length === 0) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-md border bg-background p-8 text-center">
				<div className="rounded-full bg-muted p-3">
					<SearchX
						className="h-6 w-6 text-muted-foreground"
						aria-hidden="true"
					/>
				</div>
				<div className="space-y-2">
					<h3 className="text-lg font-medium">Aucun résultat</h3>
					<p className="text-sm text-muted-foreground max-w-[300px]">
						Aucun élément ne correspond à vos critères de recherche. Essayez de
						modifier vos filtres ou d&apos;effectuer une nouvelle recherche.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			{selection && selectedItems.length > 0 && (
				<SelectionToolbar
					selectedItems={selectedItems}
					actions={selection.actions}
				/>
			)}

			<Table
				data-pending={isPending ? "" : undefined}
				className="bg-background [&_tr:last-child]:border-0 [&_tr:hover:not(thead_tr)]:bg-muted/50 group-has-[[data-pending]]:animate-pulse"
			>
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{selection && (
							<TableHead className="w-[40px] bg-muted">
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
								className={cn(
									cellStyles<T>(column),
									"select-none relative group/column h-11 bg-muted",
									column.sortable &&
										"cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
								)}
								onClick={() =>
									column.sortable && handleSortingChange(column.id)
								}
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
												getSortOrder(column.id) === "asc" ? (
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
							<TableRow key={id}>
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
			{pagination && <PagePagination {...pagination} />}
		</div>
	);
}
