"use client";

import { type GetOrganizationsReturn } from "@/domains/organization";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ViewType } from "@/shared/types";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Type des props
type OrganizationCardProps = {
	organization: GetOrganizationsReturn[0];
	viewMode?: ViewType;
};

export function OrganizationCard({
	organization,
	viewMode = "grid",
}: OrganizationCardProps) {
	// Préparation des données à afficher
	const { id, name, legalName, logoUrl, legalForm, city } = organization;

	// Première lettre pour le fallback du logo
	const initial = name.charAt(0).toUpperCase();

	// Fonction pour le menu des actions
	const renderActionMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="rounded-md p-1 hover:bg-muted transition-colors"
					aria-label="Options pour cette organisation"
					onClick={(e) => e.preventDefault()}
				>
					<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link href={`/dashboard/${id}`} className="cursor-pointer">
						Accéder au tableau de bord
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href={`/dashboard/${id}/settings`} className="cursor-pointer">
						Paramétrage
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	// Rendu en mode liste
	if (viewMode === "list") {
		return (
			<Link href={`/dashboard/${id}`} className="block">
				<div className="border rounded-lg p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
					<div className="flex items-center gap-3">
						{/* Logo */}
						<div className="h-10 w-10 shrink-0 flex items-center justify-center">
							{logoUrl ? (
								<div className="h-10 w-10 relative rounded-md overflow-hidden">
									<Image
										src={logoUrl}
										alt={name}
										fill
										sizes="40px"
										className="object-cover"
									/>
								</div>
							) : (
								<div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
									<span className="text-base font-medium text-muted-foreground">
										{initial}
									</span>
								</div>
							)}
						</div>

						{/* Nom et détails */}
						<div className="min-w-0 flex-1">
							<h3 className="font-medium truncate">{name}</h3>
							<p className="text-xs text-muted-foreground truncate">
								{legalForm && <span>{legalForm}</span>}
								{legalForm && city && <span> · </span>}
								{city && <span>{city}</span>}
							</p>
						</div>

						{/* Menu d'actions */}
						{renderActionMenu()}
					</div>
				</div>
			</Link>
		);
	}

	// Rendu en mode grille
	return (
		<Link href={`/dashboard/${id}`} className="block h-full">
			<Card className="h-full transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
				<CardContent className="p-4 flex flex-col h-full">
					<div className="flex items-start gap-3">
						{/* Logo */}
						<div className="h-12 w-12 shrink-0 flex items-center justify-center">
							{logoUrl ? (
								<div className="h-12 w-12 relative rounded-md overflow-hidden">
									<Image
										src={logoUrl}
										alt={name}
										fill
										sizes="48px"
										className="object-cover"
									/>
								</div>
							) : (
								<div className="h-12 w-12 rounded-md bg-muted/50 flex items-center justify-center">
									<span className="text-lg font-medium text-muted-foreground">
										{initial}
									</span>
								</div>
							)}
						</div>

						{/* Nom et sous-titre */}
						<div className="flex-1 min-w-0">
							<h3 className="font-medium truncate">{name}</h3>
							{legalName && legalName !== name && (
								<p className="text-xs text-muted-foreground truncate mt-0.5">
									{legalName}
								</p>
							)}
						</div>

						{/* Menu d'actions */}
						{renderActionMenu()}
					</div>

					{/* Informations secondaires */}
					<div className="pt-3 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 mt-2">
						{legalForm && <span>{legalForm}</span>}
						{city && <span>{city}</span>}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
