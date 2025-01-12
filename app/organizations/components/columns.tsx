"use client";

import { ColumnDef } from "@/components/datatable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Organization } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2, Euro, Mail, MapPin, Phone } from "lucide-react";
import RowActions from "./row-actions";

export const columns: ColumnDef<Organization>[] = [
	{
		id: "name",
		header: "Organisation",
		cell: (organization: Organization) => (
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 p-0 text-left font-normal hover:bg-transparent"
					>
						<Avatar className="mr-2 h-6 w-6">
							<AvatarFallback className="bg-primary/10">
								{organization.name
									.split(" ")
									.map((n) => n[0])
									.join("")
									.toUpperCase()
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start">
							<div className="font-medium">{organization.name}</div>
							<div className="text-xs text-muted-foreground">
								<TooltipProvider>
									{organization.siren && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge variant="secondary" className="mr-1">
													SIREN: {organization.siren}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>SIREN</TooltipContent>
										</Tooltip>
									)}
									{organization.vatNumber && (
										<Tooltip>
											<TooltipTrigger asChild>
												<Badge variant="secondary">
													TVA: {organization.vatNumber}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>Numéro de TVA</TooltipContent>
										</Tooltip>
									)}
								</TooltipProvider>
							</div>
						</div>
					</Button>
				</HoverCardTrigger>
				<HoverCardContent className="w-80">
					<Card className="p-4">
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Badge variant="default" className="gap-1">
									<Building2 className="h-3 w-3" />
									<span>{organization.legalForm || "Non renseignée"}</span>
								</Badge>
								{organization.capital && (
									<Badge variant="secondary" className="gap-1">
										<Euro className="h-3 w-3" />
										<span>
											{organization.capital.toLocaleString("fr-FR")} €
										</span>
									</Badge>
								)}
							</div>
							{organization.email && (
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 opacity-70" />
									<span className="text-sm">{organization.email}</span>
								</div>
							)}
							{organization.phone && (
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 opacity-70" />
									<span className="text-sm">{organization.phone}</span>
								</div>
							)}
							{organization.address && (
								<div className="flex items-start gap-2">
									<MapPin className="h-4 w-4 opacity-70 mt-0.5" />
									<div className="flex flex-col text-sm">
										<span>{organization.address}</span>
										<span>
											{organization.zipCode} {organization.city}
										</span>
										{organization.country && (
											<span className="text-muted-foreground">
												{organization.country}
											</span>
										)}
									</div>
								</div>
							)}
							<div className="border-t pt-2 mt-2 space-y-1">
								<div className="text-xs text-muted-foreground">
									Créée le{" "}
									{format(
										new Date(organization.createdAt),
										"d MMMM yyyy à HH:mm",
										{
											locale: fr,
										}
									)}
								</div>
								{organization.createdAt.toString() !==
									organization.updatedAt.toString() && (
									<div className="text-xs text-muted-foreground">
										Modifiée le{" "}
										{format(
											new Date(organization.updatedAt),
											"d MMMM yyyy à HH:mm",
											{
												locale: fr,
											}
										)}
									</div>
								)}
							</div>
						</div>
					</Card>
				</HoverCardContent>
			</HoverCard>
		),
		sortable: true,
		align: "left",
	},
	{
		id: "contact",
		header: "Contact",
		cell: (organization: Organization) => {
			const hasContacts = organization.email || organization.phone;

			if (!hasContacts) {
				return (
					<div className="flex h-8 items-center text-sm text-muted-foreground">
						Aucun contact
					</div>
				);
			}

			return (
				<div className="flex flex-col gap-1 w-[220px] py-1">
					<TooltipProvider>
						{organization.email && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 px-2 w-full hover:bg-muted justify-start"
									>
										<div className="flex items-center w-full gap-2">
											<div className="flex items-center justify-center w-5 h-5">
												<Mail className="h-3.5 w-3.5 text-primary" />
											</div>
											<span className="flex-1 text-sm truncate text-left">
												{organization.email}
											</span>
										</div>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="left" className="flex items-center gap-2">
									<Mail className="h-4 w-4" />
									<span>{organization.email}</span>
								</TooltipContent>
							</Tooltip>
						)}
						{organization.phone && (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-7 px-2 w-full hover:bg-muted justify-start"
									>
										<div className="flex items-center w-full gap-2">
											<div className="flex items-center justify-center w-5 h-5">
												<Phone className="h-3.5 w-3.5 text-primary" />
											</div>
											<span className="flex-1 text-sm truncate text-left">
												{organization.phone}
											</span>
										</div>
									</Button>
								</TooltipTrigger>
								<TooltipContent side="left" className="flex items-center gap-2">
									<Phone className="h-4 w-4" />
									<span>{organization.phone}</span>
								</TooltipContent>
							</Tooltip>
						)}
					</TooltipProvider>
				</div>
			);
		},
		align: "left",
	},
	{
		id: "address",
		header: "Adresse",

		cell: (organization: Organization) => {
			if (!organization.address) {
				return (
					<div className="flex h-8 items-center text-sm text-muted-foreground">
						Aucune adresse
					</div>
				);
			}

			return (
				<HoverCard>
					<HoverCardTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-[250px] px-2 hover:bg-muted group"
						>
							<div className="flex items-center gap-2 w-full">
								<div className="relative flex h-6 items-center">
									<Badge
										variant="outline"
										className="h-6 w-6 rounded-full p-0 flex items-center justify-center border-2 group-hover:border-primary/20 transition-colors"
									>
										<MapPin className="h-3 w-3 text-primary" />
									</Badge>
								</div>
								<div className="flex flex-col items-start ml-2 min-w-0">
									<div className="text-sm font-medium truncate w-full">
										{organization.city || "Non renseignée"}
									</div>
									{organization.country && (
										<div className="text-xs text-muted-foreground">
											{organization.country}
										</div>
									)}
								</div>
							</div>
						</Button>
					</HoverCardTrigger>
					<HoverCardContent className="w-80" align="start">
						<Card className="p-4">
							<div className="space-y-2">
								<div className="font-medium">{organization.address}</div>
								<div className="text-sm flex items-center gap-1.5">
									<Badge variant="secondary" className="rounded-sm">
										{organization.zipCode}
									</Badge>
									<span className="font-medium">{organization.city}</span>
								</div>
								{organization.country && (
									<div className="text-sm text-muted-foreground">
										{organization.country}
									</div>
								)}
							</div>
						</Card>
					</HoverCardContent>
				</HoverCard>
			);
		},
		align: "left",
	},
	{
		id: "actions",
		header: "Actions",
		cell: (organization: Organization) => (
			<div className="flex items-center justify-end">
				<RowActions organization={organization} />
			</div>
		),
		align: "right",
	},
];
