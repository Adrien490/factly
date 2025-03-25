"use client";

import { usePagination } from "@/shared/components/datatable/components/pagination/hooks/use-pagination";
import { Button } from "@/shared/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { getPaginationItems } from "../utils";

export interface PaginationProps {
	total: number;
	pageCount: number;
	page: number;
	perPage: number;
}

export function Pagination({
	total,
	pageCount,
	page,
	perPage,
}: PaginationProps) {
	const { isPending, handlePageChange, handlePerPageChange, getVisibleRange } =
		usePagination();

	const { start, end } = getVisibleRange(total);

	// Version ultra-simplifiée pour afficher seulement les pages utiles

	const paginationItems = getPaginationItems(pageCount, page);

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
				isPending && "opacity-70"
			)}
		>
			{/* Informations sur la pagination */}
			<div className="flex items-center gap-3 text-sm">
				<div className="flex items-center gap-2">
					<Select
						defaultValue={String(perPage)}
						onValueChange={(value) => handlePerPageChange(Number(value))}
						disabled={isPending}
					>
						<SelectTrigger className="w-[70px] h-9">
							<SelectValue placeholder={perPage} />
						</SelectTrigger>
						<SelectContent>
							{[10, 20, 50, 100].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span className="text-xs text-muted-foreground hidden sm:inline">
						par page
					</span>
				</div>

				<span className="text-sm text-muted-foreground">
					{total > 0 ? (
						<>
							<span className="font-medium text-foreground">
								{start}-{end}
							</span>{" "}
							sur <span className="font-medium text-foreground">{total}</span>
						</>
					) : (
						"Aucun résultat"
					)}
				</span>
			</div>

			{/* Contrôles de pagination */}
			{pageCount > 1 && (
				<nav
					role="navigation"
					aria-label="Pagination"
					className="flex items-center"
				>
					<div className="flex items-center rounded-lg bg-card p-1.5">
						{/* Bouton première page */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page <= 1 || isPending}
							onClick={() => handlePageChange(1)}
							className={cn(
								"h-8 w-8 mr-0.5",
								page === 1 && "bg-primary/10 text-primary"
							)}
							aria-label="Première page"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>

						{/* Bouton précédent */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page <= 1 || isPending}
							onClick={() => handlePageChange(page - 1)}
							className="h-8 w-8 mr-1"
							aria-label="Page précédente"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						{/* Affichage de page X/Y au lieu des numéros sur mobile */}
						<div className="inline sm:hidden px-2 text-sm bg-background/50 rounded-md">
							<span className="font-medium">{page}</span>
							<span className="text-muted-foreground mx-1">/</span>
							<span>{pageCount}</span>
						</div>

						{/* Pages et points de suspension pour desktop */}
						<div className="hidden sm:flex items-center">
							{paginationItems.map((item) =>
								item.type === "dots" ? (
									<div
										key={item.id}
										className="flex items-center justify-center h-8 w-8 mx-0.5 text-sm text-muted-foreground"
										aria-hidden="true"
									>
										{item.value}
									</div>
								) : (
									<Button
										key={`page-${item.value}`}
										variant={page === item.value ? "default" : "ghost"}
										size="icon"
										disabled={isPending}
										onClick={() => handlePageChange(item.value as number)}
										className={cn(
											"h-8 w-8 mx-0.5",
											isPending && "text-muted-foreground",
											page === item.value && "font-semibold"
										)}
										aria-label={`Page ${item.value}`}
										aria-current={page === item.value ? "page" : undefined}
									>
										{item.value}
									</Button>
								)
							)}
						</div>

						{/* Bouton suivant */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page >= pageCount || isPending}
							onClick={() => handlePageChange(page + 1)}
							className="h-8 w-8 ml-1"
							aria-label="Page suivante"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>

						{/* Bouton dernière page */}
						<Button
							variant="ghost"
							size="icon"
							disabled={page >= pageCount || isPending}
							onClick={() => handlePageChange(pageCount)}
							className={cn(
								"h-8 w-8 ml-0.5",
								page === pageCount && "bg-primary/10 text-primary"
							)}
							aria-label="Dernière page"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</nav>
			)}
		</div>
	);
}
