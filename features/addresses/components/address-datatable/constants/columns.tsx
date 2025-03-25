"use client";
import { GetAddressesReturn } from "@/features/addresses/get-list/types";
import { ColumnDef } from "@/shared/components/datatable/types";
import { Badge } from "@/shared/components/ui/badge";
import { formatDate } from "date-fns";
import { Building, Home, MapPin } from "lucide-react";
import { RowActions } from "../components/row-actions";

export const columns: ColumnDef<GetAddressesReturn[number]>[] = [
	{
		id: "address",
		header: "Adresse",
		sortable: true,
		visibility: "always",
		cell: (address) => (
			<div className="w-[200px] flex flex-col space-y-1">
				<div className="flex items-center gap-2">
					<MapPin className="h-4 w-4 text-muted-foreground" />
					<div className="font-medium truncate">{address.addressLine1}</div>
				</div>
				{address.addressLine2 && (
					<div className="flex items-center gap-2 ml-6 text-sm text-muted-foreground">
						<span>{address.addressLine2}</span>
					</div>
				)}
			</div>
		),
	},
	{
		id: "location",
		header: "Localité",
		visibility: "tablet",
		sortable: true,
		cell: (address) => (
			<div className="flex flex-col space-y-1">
				<div className="flex items-center gap-1.5">
					<span>{address.postalCode}</span>
					<span>{address.city}</span>
				</div>
				<div className="text-xs text-muted-foreground">{address.country}</div>
			</div>
		),
	},
	{
		id: "isDefault",
		header: "Statut",
		visibility: "tablet",
		cell: (address) => (
			<div>{address.isDefault && <Badge>Adresse principale</Badge>}</div>
		),
	},
	{
		id: "relation",
		header: "Relation",
		visibility: "desktop",
		cell: (address) => (
			<div className="flex items-center gap-2">
				{address.clientId && (
					<>
						<Home className="h-4 w-4 text-muted-foreground" />
						<span>Client</span>
					</>
				)}
				{address.supplierId && (
					<>
						<Building className="h-4 w-4 text-muted-foreground" />
						<span>Fournisseur</span>
					</>
				)}
			</div>
		),
	},
	{
		id: "createdAt",
		header: "Créée le",
		visibility: "desktop",
		sortable: true,
		cell: (address) => <div>{formatDate(address.createdAt, "dd/MM/yyyy")}</div>,
	},
	{
		id: "actions",
		header: "Actions",
		visibility: "always",
		cell: (address) => (
			<div className="flex items-center gap-2 justify-end">
				<RowActions address={address} />
			</div>
		),
	},
];
