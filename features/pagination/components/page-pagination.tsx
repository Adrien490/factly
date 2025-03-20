"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePagination } from "@/features/pagination/hooks/use-pagination";
import { cn } from "@/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

export interface PagePaginationProps {
	total: number;
	pageCount: number;
	page: number;
	perPage: number;
}

export default function PagePagination({
	total,
	pageCount,
	page,
	perPage,
}: PagePaginationProps) {
	const { isPending, handlePageChange, handlePerPageChange, getVisibleRange } =
		usePagination();

	const { start, end } = getVisibleRange(total);

	// Version ultra-simplifiée pour afficher seulement les pages utiles
	const getPaginationItems = () => {
		// Pour peu de pages, afficher tout sans points de suspension
		if (pageCount <= 5) {
			return Array.from({ length: pageCount }, (_, i) => ({
				type: "page",
				value: i + 1,
			}));
		}

		const items = [];

		// Toujours afficher la première page
		items.push({ type: "page", value: 1 });

		// Si la page active est proche du début
		if (page <= 3) {
			// Ajouter pages 2, 3, 4
			for (let i = 2; i <= 4; i++) {
				if (i <= pageCount) items.push({ type: "page", value: i });
			}

			// Un seul point de suspension puis dernière page
			if (pageCount > 5) {
				items.push({ type: "dots", value: "...", id: "dots1" });
			}
			if (pageCount > 4) {
				items.push({ type: "page", value: pageCount });
			}
		}
		// Si la page active est proche de la fin
		else if (page >= pageCount - 3) {
			// Un seul point de suspension
			items.push({ type: "dots", value: "...", id: "dots1" });

			// Puis les 4 dernières pages
			for (let i = pageCount - 3; i <= pageCount; i++) {
				if (i > 1) items.push({ type: "page", value: i });
			}
		}
		// Si la page active est au milieu
		else {
			// Un point de suspension
			items.push({ type: "dots", value: "...", id: "dots1" });

			// Une page avant la page active (si possible)
			if (page > 2) items.push({ type: "page", value: page - 1 });

			// La page active
			items.push({ type: "page", value: page });

			// Une page après la page active (si possible)
			if (page < pageCount - 1) items.push({ type: "page", value: page + 1 });

			// Un autre point de suspension
			items.push({ type: "dots", value: "...", id: "dots2" });

			// La dernière page
			items.push({ type: "page", value: pageCount });
		}

		return items;
	};

	const paginationItems = getPaginationItems();

	return (
		<div
			className={cn(
				"flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-3",
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
					<div className="flex items-center rounded-lg bg-muted/20 p-1.5 shadow-sm">
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
