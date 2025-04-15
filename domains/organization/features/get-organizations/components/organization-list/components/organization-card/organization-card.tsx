import { type GetOrganizationsReturn } from "@/domains/organization";
import { Card, CardContent } from "@/shared/components/";
import { ViewType } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";
import { ActionMenu } from "./components/action-menu";

// Type des props
type OrganizationCardProps = {
	organization: GetOrganizationsReturn[0];
	viewType?: ViewType;
};

export function OrganizationCard({
	organization,
	viewType = "grid",
}: OrganizationCardProps) {
	// Préparation des données à afficher
	const { id, name, legalName, logoUrl, legalForm, city } = organization;

	// Première lettre pour le fallback du logo
	const initial = name.charAt(0).toUpperCase();

	// Rendu en mode liste
	if (viewType === "list") {
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
						<ActionMenu id={id} />
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
						<ActionMenu id={id} />
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
