"use client";
import { CLIENT_STATUS_OPTIONS } from "@/features/client/client-status-options";
import { CLIENT_TYPE_OPTIONS } from "@/features/client/client-type-options";
import { RowActions } from "@/features/client/get-all/components/client-datatable/components/row-actions";
import { GetClientsReturn } from "@/features/client/get-all/types";
import { ColumnDef } from "@/features/shared/components/datatable/types";
import { Badge } from "@/features/shared/components/ui/badge";
import { BuildingIcon, CircleDot, MapPin, Receipt, Tag } from "lucide-react";

export const columns: ColumnDef<GetClientsReturn["clients"][number]>[] = [
	{
		id: "name",
		header: "Client",
		sortable: true,
		visibility: "always",

		cell: (client) => (
			<div className="w-[200px] flex flex-col space-y-1">
				<div className="flex items-center gap-2">
					<div className="font-medium truncate">{client.name}</div>
				</div>
				{client.reference && (
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<Tag className="h-3 w-3 shrink-0" />
						<span>{client.reference}</span>
					</div>
				)}
			</div>
		),
	},
	{
		id: "clientType",
		header: "Type",
		visibility: "tablet",
		cell: (client) => (
			<div className="flex items-center gap-2">
				<BuildingIcon className="h-4 w-4 text-muted-foreground shrink-0" />
				<span>
					{
						CLIENT_TYPE_OPTIONS.find(
							(option) => option.value === client.clientType
						)?.label
					}
				</span>
			</div>
		),
	},
	{
		id: "status",
		header: "Statut",
		sortable: true,
		visibility: "tablet",
		cell: (client) => (
			<div>
				<Badge
					className={
						CLIENT_STATUS_OPTIONS.find(
							(option) => option.value === client.status
						)?.color || "outline"
					}
				>
					{
						CLIENT_STATUS_OPTIONS.find(
							(option) => option.value === client.status
						)?.label
					}
				</Badge>
			</div>
		),
	},

	{
		id: "fiscalInfo",
		header: "Infos fiscales",
		visibility: "desktop",
		cell: (client) => (
			<div className="flex flex-col space-y-1 max-w-[150px]">
				{client.siret && (
					<div className="flex items-center gap-1.5 text-xs">
						<Receipt className="h-3 w-3 shrink-0 text-muted-foreground" />
						<span className="truncate">{client.siret}</span>
					</div>
				)}
				{client.vatNumber && (
					<div className="flex items-center gap-1.5 text-xs">
						<CircleDot className="h-3 w-3 shrink-0 text-muted-foreground" />
						<span className="truncate">{client.vatNumber}</span>
					</div>
				)}
				{!client.siret && !client.vatNumber && (
					<span className="text-xs text-muted-foreground italic">
						Non renseignées
					</span>
				)}
			</div>
		),
	},
	{
		id: "address",
		header: "Adresse",
		visibility: "desktop",
		cell: (client) => {
			const address = client.addresses?.find((addr) => addr.isDefault);
			return (
				<div className="flex items-center gap-2 max-w-[200px]">
					<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
					{address ? (
						<span className="truncate">
							{[address.addressLine1, address.postalCode, address.city]
								.filter(Boolean)
								.join(", ")}
						</span>
					) : (
						<span className="text-muted-foreground italic">Non renseignée</span>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		visibility: "desktop",
		cell: (client) => (
			<div className="flex items-center gap-2 justify-end">
				<RowActions client={client} />
			</div>
		),
	},
];
