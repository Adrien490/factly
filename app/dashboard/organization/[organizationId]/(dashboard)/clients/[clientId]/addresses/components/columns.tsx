"use client";

import { ColumnDef } from "@/components/datatable";
import { Badge } from "@/components/ui/badge";
import { Address, AddressType } from "@prisma/client";
import { Check } from "lucide-react";
import RowActions from "./row-actions";

const getAddressTypeConfig = (
	type: AddressType
): {
	label: string;
	variant: "default" | "secondary" | "outline";
} => {
	switch (type) {
		case AddressType.BILLING:
			return {
				label: "Facturation",
				variant: "default",
			};
		case AddressType.DELIVERY:
			return {
				label: "Livraison",
				variant: "secondary",
			};
		default:
			return {
				label: "Autre",
				variant: "outline",
			};
	}
};

export const columns: ColumnDef<Address>[] = [
	{
		id: "type",
		header: "Type",
		visibility: "always",
		cell: (address) => (
			<div className="w-[120px]">
				<Badge variant={getAddressTypeConfig(address.addressType).variant}>
					{getAddressTypeConfig(address.addressType).label}
				</Badge>
			</div>
		),
	},
	{
		id: "address",
		header: "Adresse",
		visibility: "always",
		cell: (address) => (
			<div className="w-[250px]">
				<div className="font-medium">{address.line1}</div>
				{address.line2 && (
					<div className="text-sm text-muted-foreground">{address.line2}</div>
				)}
				<div className="text-sm text-muted-foreground">
					{address.zipCode} {address.city}
				</div>
			</div>
		),
	},
	{
		id: "country",
		header: "Pays",
		visibility: "tablet",
		cell: (address) => (
			<div className="w-[120px]">
				{address.country === "FR"
					? "France"
					: address.country === "BE"
					? "Belgique"
					: address.country === "CH"
					? "Suisse"
					: address.country === "LU"
					? "Luxembourg"
					: address.country}
			</div>
		),
	},
	{
		id: "isDefault",
		header: "Par défaut",
		visibility: "tablet",
		cell: (address) => (
			<div className="w-[100px]">
				{address.isDefault && <Check className="h-4 w-4 text-primary" />}
			</div>
		),
	},
	{
		id: "actions",
		header: "",
		visibility: "always",
		sortable: false,
		cell: (address) => (
			<div className="w-[50px] flex justify-end">
				<RowActions address={address} />
			</div>
		),
	},
];
