"use client";

import { ColumnDef } from "@/components/datatable";
import { Badge } from "@/components/ui/badge";
import { ClientStatus } from "@prisma/client";
import { Mail, MapPin, Phone } from "lucide-react";
import { GetClientsReturn } from "../server/get-clients";
import RowActions from "./client-actions";

type ClientWithAddresses = GetClientsReturn["clients"][number];

type StatusBadgeVariant = "default" | "secondary" | "outline" | "destructive";

const getStatusConfig = (
	status: ClientStatus
): {
	label: string;
	variant: StatusBadgeVariant;
} => {
	switch (status) {
		case "LEAD":
			return {
				label: "Prospect non qualifié",
				variant: "secondary",
			};
		case "PROSPECT":
			return {
				label: "Prospect qualifié",
				variant: "secondary",
			};
		case "ACTIVE":
			return {
				label: "Client actif",
				variant: "default",
			};
		case "INACTIVE":
			return {
				label: "Client inactif",
				variant: "outline",
			};
		case "ARCHIVED":
			return {
				label: "Client archivé",
				variant: "destructive",
			};
	}
};

export const columns: ColumnDef<ClientWithAddresses>[] = [
	{
		id: "name",
		header: "Client",
		visibility: "always",
		sortable: true,
		cell: (client) => (
			<div className="w-[180px] md:w-[200px]">
				<div className="flex items-center gap-2">
					<div className="font-medium truncate">{client.name}</div>
					{client.reference && (
						<Badge variant="outline" className="shrink-0">
							{client.reference}
						</Badge>
					)}
				</div>
				<div className="md:hidden space-y-2">
					{client.email && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Mail className="h-3 w-3 shrink-0" />
							<span className="truncate">{client.email}</span>
						</div>
					)}
					{client.phone && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Phone className="h-3 w-3 shrink-0" />
							<span className="truncate">{client.phone}</span>
						</div>
					)}
					{client.addresses?.[0] && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="h-3 w-3 shrink-0" />
							<span className="truncate">
								{[client.addresses[0].city, client.addresses[0].zipCode]
									.filter(Boolean)
									.join(", ")}
							</span>
						</div>
					)}
				</div>
			</div>
		),
	},
	{
		id: "status",
		header: "Statut",
		visibility: "tablet",

		cell: (client) => (
			<div className="w-[130px]">
				<Badge variant={getStatusConfig(client.status).variant}>
					{getStatusConfig(client.status).label}
				</Badge>
			</div>
		),
	},
	{
		id: "email",
		header: "Email",
		visibility: "tablet",

		cell: (client) => (
			<div className="w-[180px] truncate">
				{client.email || (
					<span className="text-muted-foreground">Non renseigné</span>
				)}
			</div>
		),
	},
	{
		id: "phone",
		header: "Téléphone",
		visibility: "desktop",

		cell: (client) => (
			<div className="w-[130px] truncate">
				{client.phone || (
					<span className="text-muted-foreground">Non renseigné</span>
				)}
			</div>
		),
	},
	{
		id: "city",
		header: "Ville",
		visibility: "desktop",

		cell: (client) => {
			const address = client.addresses?.[0];
			return (
				<div className="w-[130px] truncate">
					{address ? (
						<span>
							{[address.city, address.zipCode].filter(Boolean).join(" ")}
						</span>
					) : (
						<span className="text-muted-foreground">Non renseigné</span>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		header: "",
		visibility: "always",
		sortable: false,
		cell: (client) => (
			<div className="w-[50px] flex justify-end">
				<RowActions client={client} />
			</div>
		),
	},
];
