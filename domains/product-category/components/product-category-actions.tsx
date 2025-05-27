import { ArchiveProductCategoryAlertDialog } from "@/domains/product-category/features/archive-product-category/components/archive-product-category-alert-dialog";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { ProductCategoryStatus } from "@prisma/client";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { GetProductCategoriesReturn } from "../features/get-product-categories/types";

interface ProductCategoryActionsProps {
	category: GetProductCategoriesReturn["categories"][number];
}

export function ProductCategoryActions({
	category,
}: ProductCategoryActionsProps) {
	// Récupérer les ancêtres pour construire l'URL complète

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
					)}
					aria-label="Menu d'actions"
					type="button"
				>
					<MoreVerticalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={4}
				className="w-48"
			>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/products/categories/${category.id}/edit`}
						className={cn("flex w-full items-center")}
					>
						<span>Modifier</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/products/categories/${category.id}/details`}
						className={cn("flex w-full items-center")}
					>
						<span>Voir les détails</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{category.status !== ProductCategoryStatus.ARCHIVED && (
					<DropdownMenuItem
						preventDefault
						className="text-destructive focus:text-destructive p-0"
					>
						<ArchiveProductCategoryAlertDialog
							name={category.name}
							id={category.id}
						>
							<span className="w-full text-left px-2 py-1.5">Archiver</span>
						</ArchiveProductCategoryAlertDialog>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
