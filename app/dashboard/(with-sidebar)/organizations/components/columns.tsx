"use client";

import { ColumnDef } from "@/components/datatable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Organization } from "@prisma/client";
import { Euro, Globe, Mail, MapPin, Phone, Receipt } from "lucide-react";
import RowActions from "./row-actions";

export const columns: ColumnDef<Organization>[] = [
	{
		id: "name",
		header: "Organisation",
		visibility: "always",
		sortable: true,
		cell: (organization) => (
			<div className="w-[180px] md:w-[200px]">
				<div className="flex items-center gap-3">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={organization.logo || undefined}
							alt={organization.name}
						/>
						<AvatarFallback className="bg-primary/10">
							{organization.name
								.split(" ")
								.map((word) => word[0])
								.join("")
								.toUpperCase()
								.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium truncate">{organization.name}</div>
						<div className="flex items-center gap-1.5 flex-wrap">
							{organization.legalForm && (
								<Badge variant="secondary" className="text-xs">
									{organization.legalForm}
								</Badge>
							)}
							{organization.capital && (
								<Badge variant="outline" className="text-xs gap-1">
									<Euro className="h-3 w-3" />
									{organization.capital.toLocaleString("fr-FR")}
								</Badge>
							)}
						</div>
					</div>
				</div>
				<div className="md:hidden space-y-2 mt-2">
					{organization.email && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Mail className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">{organization.email}</span>
						</div>
					)}
					{organization.phone && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Phone className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">{organization.phone}</span>
						</div>
					)}
					{(organization.address || organization.city) && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">
								{[organization.address, organization.city, organization.zipCode]
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
		id: "fiscal",
		header: "Informations fiscales",
		visibility: "tablet",
		cell: (organization) => (
			<div className="w-[200px] space-y-1">
				{organization.siren && (
					<div className="flex items-center gap-2 text-sm">
						<Receipt className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
						<span className="truncate">SIREN: {organization.siren}</span>
					</div>
				)}
				{organization.siret && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Receipt className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">SIRET: {organization.siret}</span>
					</div>
				)}
				{organization.vatNumber && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Receipt className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">TVA: {organization.vatNumber}</span>
					</div>
				)}
				{organization.vatOptionDebits && (
					<Badge variant="outline" className="text-xs">
						TVA sur les débits
					</Badge>
				)}
			</div>
		),
	},
	{
		id: "contact",
		header: "Contact",
		visibility: "tablet",
		cell: (organization) => (
			<div className="w-[200px] space-y-1">
				{organization.email && (
					<div className="flex items-center gap-2 text-sm">
						<Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
						<span className="truncate">{organization.email}</span>
					</div>
				)}
				{organization.phone && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Phone className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">{organization.phone}</span>
					</div>
				)}
				{organization.website && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Globe className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">{organization.website}</span>
					</div>
				)}
			</div>
		),
	},
	{
		id: "address",
		header: "Adresse",
		visibility: "desktop",
		cell: (organization) => (
			<div className="w-[200px] space-y-1">
				{organization.address && (
					<div className="text-sm truncate">{organization.address}</div>
				)}
				{(organization.city || organization.zipCode) && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-3.5 w-3.5 shrink-0" />
						<span className="truncate">
							{[organization.city, organization.zipCode]
								.filter(Boolean)
								.join(" ")}
						</span>
					</div>
				)}
				{organization.country && (
					<div className="text-sm text-muted-foreground truncate">
						{organization.country}
					</div>
				)}
			</div>
		),
	},
	{
		id: "actions",
		header: "",
		visibility: "always",
		sortable: false,
		cell: (organization) => (
			<div className="w-[50px] flex justify-end">
				<RowActions organization={organization} />
			</div>
		),
	},
];
