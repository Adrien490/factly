"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

export type PagePagination = {
	total: number;
	pageCount: number;
	page: number;
	perPage: number;
};

export default function PagePagination({
	total,
	pageCount,
	page,
	perPage,
}: PagePagination) {
	const {
		isPending,
		handlePageChange,
		handlePerPageChange,
		getPageNumbers,
		getVisibleRange,
	} = usePagination();

	const pageNumbers = getPageNumbers(pageCount);
	const { start, end } = getVisibleRange(total);

	return (
		<nav
			data-pending={isPending ? "" : undefined}
			role="navigation"
			aria-label="Pagination"
			className="flex flex-col gap-4 border-t py-3"
		>
			<div className="flex flex-row flex-wrap items-center justify-between gap-3 text-sm">
				<div className="flex items-center gap-3">
					<Select
						defaultValue={String(perPage)}
						onValueChange={(value) => handlePerPageChange(Number(value))}
						disabled={isPending}
					>
						<SelectTrigger
							className={cn(
								"w-[70px] sm:w-[100px]",
								isPending && "text-muted-foreground"
							)}
						>
							<SelectValue placeholder="Par page" />
						</SelectTrigger>
						<SelectContent align="end">
							{[10, 20, 50, 100].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}{" "}
									{size <= 20 && (
										<span className="hidden sm:inline">par page</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-muted-foreground">
						{total > 0 ? (
							<>
								<span className="hidden sm:inline">Affichage de </span>
								<span className="font-medium">{start}</span>-
								<span className="font-medium">{end}</span>
								<span className="hidden sm:inline"> sur </span>
								<span className="inline sm:hidden">/</span>
								<span className="font-medium">{total}</span>
							</>
						) : (
							"Aucun résultat"
						)}
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1 || isPending}
						onClick={() => handlePageChange(page - 1)}
						className={cn(
							"gap-1 px-2 sm:px-3",
							isPending && "text-muted-foreground"
						)}
						aria-label="Page précédente"
					>
						<span className="hidden sm:inline">Précédent</span>
						<span className="inline sm:hidden">←</span>
					</Button>

					<div className="flex items-center gap-1">
						{pageNumbers.map((pageNum, i) =>
							pageNum === -1 ? (
								<span
									key={`ellipsis-${i}`}
									className="hidden px-2 text-muted-foreground sm:inline"
								>
									...
								</span>
							) : (
								<Button
									key={pageNum}
									variant={page === pageNum ? "outline" : "ghost"}
									size="sm"
									className={cn(
										"h-8 w-8",
										isPending && "text-muted-foreground",
										"hidden sm:inline-flex"
									)}
									disabled={isPending}
									onClick={() => handlePageChange(pageNum)}
									aria-label={`Page ${pageNum}`}
									aria-current={page === pageNum ? "page" : undefined}
								>
									{pageNum}
								</Button>
							)
						)}
						<span className="inline sm:hidden text-sm text-muted-foreground">
							{page} / {pageCount}
						</span>
					</div>

					<Button
						variant="outline"
						size="sm"
						disabled={page >= pageCount || isPending}
						onClick={() => handlePageChange(page + 1)}
						className={cn(
							"gap-1 px-2 sm:px-3",
							isPending && "text-muted-foreground"
						)}
						aria-label="Page suivante"
					>
						<span className="hidden sm:inline">Suivant</span>
						<span className="inline sm:hidden">→</span>
					</Button>
				</div>
			</div>
		</nav>
	);
}
