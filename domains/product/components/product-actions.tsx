import {
	PRODUCT_STATUS_OPTIONS,
	PRODUCT_STATUS_TRANSITIONS,
} from "@/domains/product/constants";
import { ArchiveProductAlertDialog } from "@/domains/product/features/archive-product/components/archive-product-alert-dialog";
import { UpdateProductStatusButton } from "@/domains/product/features/update-product-status/components/update-product-status-button";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	LoadingIndicator,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { ProductStatus } from "@prisma/client";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { GetProductsReturn } from "../features/get-products/types";

interface ProductActionsProps {
	product: GetProductsReturn["products"][number];
}

export function ProductActions({ product }: ProductActionsProps) {
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
						href={`/dashboard/${product.organizationId}/products/${product.id}`}
						className={cn("flex w-full items-center")}
					>
						Fiche produit
						<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${product.organizationId}/products/${product.id}/edit`}
						className={cn("flex w-full items-center")}
					>
						<span>Modifier</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Changer le statut</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{PRODUCT_STATUS_OPTIONS.filter(
							(status) =>
								status.value !== ProductStatus.ARCHIVED &&
								PRODUCT_STATUS_TRANSITIONS[product.status].includes(
									status.value
								)
						).map((status) => (
							<UpdateProductStatusButton
								key={status.value}
								organizationId={product.organizationId}
								id={product.id}
								status={status.value}
							>
								<DropdownMenuItem>
									<div className="flex items-center gap-2">
										<div
											className="h-2 w-2 rounded-full"
											style={{ backgroundColor: status.color }}
										/>
										<span>{status.label}</span>
									</div>
								</DropdownMenuItem>
							</UpdateProductStatusButton>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem
					preventDefault
					className="text-destructive focus:text-destructive p-0"
				>
					<ArchiveProductAlertDialog
						name={product.name}
						organizationId={product.organizationId}
						id={product.id}
					>
						<span className="w-full text-left px-2 py-1.5">Archiver</span>
					</ArchiveProductAlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
