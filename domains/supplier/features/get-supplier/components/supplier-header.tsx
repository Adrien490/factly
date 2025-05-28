import NotFound from "@/app/dashboard/not-found";
import {
	SUPPLIER_STATUS_COLORS,
	SUPPLIER_STATUS_LABELS,
	SUPPLIER_TYPE_COLORS,
	SUPPLIER_TYPE_LABELS,
} from "@/domains/supplier/constants";
import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/ui/badge";
import { use } from "react";
import { GetSupplierReturn } from "../types";

interface SupplierHeaderProps {
	supplierPromise: Promise<GetSupplierReturn | null>;
}

export function SupplierHeader({ supplierPromise }: SupplierHeaderProps) {
	const supplier = use(supplierPromise);

	if (!supplier) {
		return <NotFound />;
	}

	const displayName = supplier.company?.name || supplier.reference;

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{displayName}
						</h1>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								style={{
									backgroundColor: `${SUPPLIER_STATUS_COLORS[supplier.status]}20`,
									color: SUPPLIER_STATUS_COLORS[supplier.status],
									borderColor: SUPPLIER_STATUS_COLORS[supplier.status],
								}}
							>
								{SUPPLIER_STATUS_LABELS[supplier.status]}
							</Badge>
							<Badge
								style={{
									backgroundColor: `${SUPPLIER_TYPE_COLORS[supplier.type]}20`,
									color: SUPPLIER_TYPE_COLORS[supplier.type],
									borderColor: SUPPLIER_TYPE_COLORS[supplier.type],
								}}
								variant="outline"
							>
								{SUPPLIER_TYPE_LABELS[supplier.type]}
							</Badge>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
						{supplier.reference && (
							<div className="flex items-center gap-1.5">
								<span className="font-medium">Référence:</span>
								<span>{supplier.reference}</span>
							</div>
						)}
						{supplier.reference && (
							<span className="text-muted-foreground/50">•</span>
						)}
						<div className="flex items-center gap-1.5">
							<span className="font-medium">ID:</span>
							<span className="font-mono">{supplier.id.substring(0, 8)}</span>
						</div>
					</div>
				</div>

				{/* Actions et navigation */}
				<div className="flex flex-wrap gap-3">
					<HorizontalMenu
						items={[
							{
								title: "Fiche fournisseur",
								url: `/dashboard/commercial/suppliers/${supplier.id}`,
							},
							{
								title: "Modifier",
								url: `/dashboard/commercial/suppliers/${supplier.id}/edit`,
							},
							{
								title: "Gestion des adresses",
								url: `/dashboard/commercial/suppliers/${supplier.id}/addresses`,
							},
							{
								title: "Gestion des contacts",
								url: `/dashboard/commercial/suppliers/${supplier.id}/contacts`,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
