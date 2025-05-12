import { PRODUCT_STATUS_OPTIONS } from "@/domains/product/constants";
import { DeleteProductAlertDialog } from "@/domains/product/features/delete-product/components/delete-product-alert-dialog";
import { RestoreProductAlertDialog } from "@/domains/product/features/restore-product/components/restore-product-alert-dialog";
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

interface ArchivedProductActionsProps {
	product: GetProductsReturn["products"][number];
}

export function ArchivedProductActions({
	product,
}: ArchivedProductActionsProps) {
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
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Restaurer</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{PRODUCT_STATUS_OPTIONS.filter(
							(status) => status.value !== ProductStatus.ARCHIVED
						).map((status) => (
							<DropdownMenuItem
								className="p-0"
								preventDefault
								key={status.value}
							>
								<RestoreProductAlertDialog
									status={status}
									name={product.name}
									organizationId={product.organizationId}
									id={product.id}
								>
									<div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer w-full">
										<div
											className="h-2 w-2 rounded-full"
											style={{ backgroundColor: status.color }}
										/>
										<span>{status.label}</span>
									</div>
								</RestoreProductAlertDialog>
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					preventDefault
				>
					<DeleteProductAlertDialog
						name={product.name}
						organizationId={product.organizationId}
						id={product.id}
					>
						<span>Supprimer définitivement</span>
					</DeleteProductAlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
