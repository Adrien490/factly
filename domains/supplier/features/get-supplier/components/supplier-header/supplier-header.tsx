import NotFound from "@/app/dashboard/[organizationId]/not-found";
import {
	SUPPLIER_STATUSES,
	SUPPLIER_TYPES,
} from "@/domains/supplier/constants";
import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/ui/badge";
import { Mail, MapPin, Phone, Users } from "lucide-react";
import { use } from "react";
import { GetSupplierReturn } from "../../types";

interface SupplierHeaderProps {
	supplierPromise: Promise<GetSupplierReturn | null>;
}

export function SupplierHeader({ supplierPromise }: SupplierHeaderProps) {
	const supplier = use(supplierPromise);

	if (!supplier) {
		return <NotFound />;
	}

	const statusInfo = SUPPLIER_STATUSES.find(
		(option) => option.value === supplier.status
	);
	const supplierTypeInfo = SUPPLIER_TYPES.find(
		(option) => option.value === supplier.supplierType
	);

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{supplier.name}
						</h1>
						<div className="flex items-center gap-2">
							{statusInfo && (
								<Badge
									variant="outline"
									style={{
										backgroundColor: `${statusInfo.color}20`,
										color: statusInfo.color,
										borderColor: statusInfo.color,
									}}
								>
									{statusInfo.label}
								</Badge>
							)}
							{supplierTypeInfo && (
								<Badge
									style={{
										backgroundColor: `${supplierTypeInfo.color}20`,
										color: supplierTypeInfo.color,
										borderColor: supplierTypeInfo.color,
									}}
									variant="outline"
								>
									{supplierTypeInfo.label}
								</Badge>
							)}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
						{supplier.vatNumber && (
							<>
								<div className="flex items-center gap-1.5">
									<span className="font-medium">Numéro de TVA :</span>
									<span>{supplier.vatNumber}</span>
								</div>
								<span className="text-muted-foreground/50">•</span>
							</>
						)}
						<div className="flex items-center gap-1.5">
							<span className="font-medium">ID :</span>
							<span className="font-mono">{supplier.id.substring(0, 8)}</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
						{supplier.email && (
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<Mail className="w-3.5 h-3.5" />
								<a
									href={`mailto:${supplier.email}`}
									className="hover:underline"
								>
									{supplier.email}
								</a>
							</div>
						)}

						{supplier.phone && (
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<Phone className="w-3.5 h-3.5" />
								<a href={`tel:${supplier.phone}`} className="hover:underline">
									{supplier.phone}
								</a>
							</div>
						)}

						{supplier.addresses && supplier.addresses.length > 0 && (
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<MapPin className="w-3.5 h-3.5" />
								<span>
									{supplier.addresses.filter((a) => a.isDefault).length}{" "}
									adresse(s)
								</span>
							</div>
						)}

						{supplier.contacts && supplier.contacts.length > 0 && (
							<div className="flex items-center gap-1.5 text-sm text-muted-foreground">
								<Users className="w-3.5 h-3.5" />
								<span>{supplier.contacts.length} contact(s)</span>
							</div>
						)}
					</div>
				</div>

				{/* Actions et navigation */}
				<div className="flex flex-wrap gap-3">
					<HorizontalMenu
						items={[
							{
								title: "Fiche fournisseur",
								url: `/dashboard/${supplier.organizationId}/suppliers/${supplier.id}`,
							},
							{
								title: "Modifier",
								url: `/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/edit`,
							},
							{
								title: "Contacts",
								url: `/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/contacts`,
							},
							/*
							{
								title: "Produits",
								url: `/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/products`,
							},
							{
								title: "Commandes",
								url: `/dashboard/${supplier.organizationId}/suppliers/${supplier.id}/orders`,
							},
              */
						]}
					/>
				</div>
			</div>
		</div>
	);
}
