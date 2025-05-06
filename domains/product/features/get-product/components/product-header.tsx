import NotFound from "@/app/dashboard/[organizationId]/not-found";
import {
	PRODUCT_STATUS_COLORS,
	PRODUCT_STATUS_LABELS,
} from "@/domains/product/constants";
import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/ui/badge";
import { formatPrice } from "@/shared/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { GetProductReturn } from "../types";

interface ProductHeaderProps {
	productPromise: Promise<GetProductReturn>;
}

export function ProductHeader({ productPromise }: ProductHeaderProps) {
	const product = use(productPromise);
	if (!product) {
		return <NotFound />;
	}

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div className="flex items-start gap-4">
					{/* Image du produit */}
					<div className="flex-shrink-0">
						{product.imageUrl ? (
							<div className="relative h-16 w-16 rounded-md overflow-hidden">
								<Image
									src={product.imageUrl}
									alt={product.name}
									fill
									sizes="64px"
									className="object-cover"
									priority
								/>
							</div>
						) : (
							<div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
								<ImageIcon className="h-8 w-8 text-muted-foreground" />
							</div>
						)}
					</div>

					<div className="flex-grow">
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
								{product.name}
							</h1>
							<div className="flex items-center gap-2">
								<Badge
									variant="outline"
									style={{
										backgroundColor: `${
											PRODUCT_STATUS_COLORS[product.status]
										}20`,
										color: PRODUCT_STATUS_COLORS[product.status],
										borderColor: PRODUCT_STATUS_COLORS[product.status],
									}}
								>
									{PRODUCT_STATUS_LABELS[product.status]}
								</Badge>
								{product.supplier && (
									<Badge variant="outline" className="bg-muted/50">
										{product.supplier.name}
									</Badge>
								)}
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
							{product.reference && (
								<div className="flex items-center gap-1.5">
									<span className="font-medium">Référence:</span>
									<span>{product.reference}</span>
								</div>
							)}
							{product.reference && (
								<span className="text-muted-foreground/50">•</span>
							)}
							<div className="flex items-center gap-1.5">
								<span className="font-medium">ID:</span>
								<span className="font-mono">{product.id.substring(0, 8)}</span>
							</div>
							<span className="text-muted-foreground/50">•</span>
							<div className="flex items-center gap-1.5">
								<span className="font-medium">Prix:</span>
								<span className="font-semibold">
									{formatPrice(product.price)}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Actions et navigation */}
				<div className="flex flex-wrap gap-3">
					<HorizontalMenu
						items={[
							{
								title: "Fiche produit",
								url: `/dashboard/${product.organizationId}/products/${product.id}`,
							},
							{
								title: "Modifier",
								url: `/dashboard/${product.organizationId}/products/${product.id}/edit`,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
