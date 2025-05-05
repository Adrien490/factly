import { ArchiveProductCategoryAlertDialog } from "@/domains/product-category/features/archive-product-category/components/archive-product-category-alert-dialog";
import { getCategoryUrl } from "@/domains/product-category/utils";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	LoadingIndicator,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { ProductCategoryStatus } from "@prisma/client";
import { FolderOpen, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { GetProductCategoriesReturn } from "../features/get-product-categories/types";

interface ProductCategoryActionsProps {
	category: GetProductCategoriesReturn["categories"][number];
	organizationId: string;
}

export function ProductCategoryActions({
	category,
	organizationId,
}: ProductCategoryActionsProps) {
	// Récupérer les ancêtres pour construire l'URL complète
	const categoryUrl = getCategoryUrl(organizationId, category.slug);

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
				{category.childCount && category.childCount > 0 && (
					<>
						<DropdownMenuItem asChild>
							<Link
								href={categoryUrl}
								className={cn("flex w-full items-center")}
							>
								<FolderOpen className="mr-2 h-4 w-4" />
								Sous-catégories
								<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${organizationId}/products/categories/${category.id}/edit`}
						className={cn("flex w-full items-center")}
					>
						<span>Modifier</span>
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${organizationId}/products/categories/${category.id}/details`}
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
							organizationId={category.organizationId}
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
