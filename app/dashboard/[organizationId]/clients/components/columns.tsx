"use client";

import { clientPriorities } from "@/features/clients/constants/client-priorities";
import { clientStatuses } from "@/features/clients/constants/client-statuses";
import { GetClientsReturn } from "@/features/clients/queries/get-clients/types";
import { ColumnDef } from "@/shared/components/datatable/components/datatable";
import { Badge } from "@/shared/components/ui/badge";
import { ClientPriority, ClientStatus, ClientType } from "@prisma/client";
import {
	BuildingIcon,
	CircleDot,
	MapPin,
	Receipt,
	Star,
	Tag,
} from "lucide-react";
import RowActions from "./row-actions";

// Mapping des variants de Badge pour les statuts client
const STATUS_VARIANTS: Record<
	ClientStatus,
	"default" | "secondary" | "destructive" | "outline"
> = {
	[ClientStatus.LEAD]: "secondary",
	[ClientStatus.PROSPECT]: "default",
	[ClientStatus.ACTIVE]: "default",
	[ClientStatus.INACTIVE]: "outline",
	[ClientStatus.ARCHIVED]: "destructive",
};

// Mapping des libellés pour les types de client
const TYPE_LABELS: Record<ClientType, string> = {
	[ClientType.INDIVIDUAL]: "Particulier",
	[ClientType.COMPANY]: "Entreprise",
};

// Mapping des couleurs pour les priorités clients
const PRIORITY_COLORS: Record<ClientPriority, string> = {
	[ClientPriority.LOW]: "text-slate-400",
	[ClientPriority.MEDIUM]: "text-blue-500",
	[ClientPriority.HIGH]: "text-amber-500",
	[ClientPriority.STRATEGIC]: "text-rose-600",
};

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
				<span>{TYPE_LABELS[client.clientType] || client.clientType}</span>
			</div>
		),
	},
	{
		id: "status",
		header: "Statut",
		sortable: true,
		visibility: "always",
		cell: (client) => (
			<div>
				<Badge variant={STATUS_VARIANTS[client.status] || "outline"}>
					{
						clientStatuses.find((option) => option.value === client.status)
							?.label
					}
				</Badge>
			</div>
		),
	},
	{
		id: "priority",
		header: "Priorité",
		sortable: true,
		visibility: "tablet",
		cell: (client) => (
			<div className="flex items-center gap-2">
				<Star
					className={`h-4 w-4 shrink-0 ${PRIORITY_COLORS[client.priority]}`}
				/>
				<span>
					{
						clientPriorities.find((option) => option.value === client.priority)
							?.label
					}
				</span>
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
		header: "Adresse de facturation",
		visibility: "desktop",
		cell: (client) => {
			const billingAddress = client.addresses?.find(
				(addr) => addr.addressType === "BILLING"
			);
			return (
				<div className="flex items-center gap-2 max-w-[200px]">
					<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
					{billingAddress ? (
						<span className="truncate">
							{[
								billingAddress.line1,
								billingAddress.postalCode,
								billingAddress.city,
							]
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
		header: "",
		align: "right",
		visibility: "always",
		cell: (client) => (
			<div className="flex justify-end">
				<RowActions client={client} />
			</div>
		),
	},
];
