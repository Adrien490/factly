"use client";

import { type GetInvitationsReturn } from "@/features/invitations/queries/get-invitations";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Building2 } from "lucide-react";
import Image from "next/image";

// Type pour le mode d'affichage
type ViewType = "grid" | "list";

// Type des props
type InvitationCardProps = {
	invitation: GetInvitationsReturn[0];
	viewMode?: ViewType;
};

export default function InvitationCard({
	invitation,
	viewMode = "grid",
}: InvitationCardProps) {
	// Extraction des données
	const { status, createdAt, organization } = invitation;

	// Date relative
	const timeAgo = formatDistanceToNow(new Date(createdAt), {
		addSuffix: true,
		locale: fr,
	});

	// Couleur de statut
	const getStatusConfig = () => {
		switch (status) {
			case "PENDING":
				return {
					label: "En attente",
					variant: "secondary" as const,
					showActions: true,
				};
			case "ACCEPTED":
				return {
					label: "Acceptée",
					variant: "default" as const,
					showActions: false,
				};
			case "REJECTED":
				return {
					label: "Refusée",
					variant: "destructive" as const,
					showActions: false,
				};
			default:
				return {
					label: status,
					variant: "outline" as const,
					showActions: false,
				};
		}
	};

	const statusConfig = getStatusConfig();

	// Gestion des actions
	const handleAccept = () => {
		console.log("accept");
	};

	const handleDecline = () => {
		console.log("decline");
	};

	// Rendu en mode liste
	if (viewMode === "list") {
		return (
			<div className="border rounded-lg p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
				<div className="flex items-center gap-3">
					{/* Logo */}
					<div className="h-10 w-10 shrink-0 flex items-center justify-center">
						{organization.logoUrl ? (
							<div className="h-10 w-10 relative rounded-md overflow-hidden">
								<Image
									src={organization.logoUrl}
									alt={organization.name}
									fill
									sizes="40px"
									className="object-cover"
								/>
							</div>
						) : (
							<div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
								<Building2 className="h-5 w-5 text-muted-foreground" />
							</div>
						)}
					</div>

					{/* Informations */}
					<div className="min-w-0 flex-1">
						<h3 className="font-medium truncate">{organization.name}</h3>
						<p className="text-xs text-muted-foreground">
							Invitation reçue {timeAgo}
						</p>
					</div>

					{/* Statut */}
					<Badge variant={statusConfig.variant} className="mr-2">
						{statusConfig.label}
					</Badge>

					{/* Actions */}
					{statusConfig.showActions && (
						<div className="flex gap-2">
							<Button size="sm" variant="default" onClick={handleAccept}>
								Accepter
							</Button>
							<Button size="sm" variant="outline" onClick={handleDecline}>
								Refuser
							</Button>
						</div>
					)}
				</div>
			</div>
		);
	}

	// Rendu en mode grille
	return (
		<Card className="h-full transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
			<CardContent className="p-4 flex flex-col h-full">
				<div className="flex items-start gap-3">
					{/* Logo */}
					<div className="h-12 w-12 shrink-0 flex items-center justify-center">
						{organization.logoUrl ? (
							<div className="h-12 w-12 relative rounded-md overflow-hidden">
								<Image
									src={organization.logoUrl}
									alt={organization.name}
									fill
									sizes="48px"
									className="object-cover"
								/>
							</div>
						) : (
							<div className="h-12 w-12 rounded-md bg-muted/50 flex items-center justify-center">
								<Building2 className="h-6 w-6 text-muted-foreground" />
							</div>
						)}
					</div>

					{/* Nom et statut */}
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start gap-2">
							<h3 className="font-medium truncate">{organization.name}</h3>
							<Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Invitation reçue {timeAgo}
						</p>
					</div>
				</div>

				{/* Actions */}
				{statusConfig.showActions && (
					<div className="flex gap-2 mt-4 pt-2 border-t">
						<Button className="flex-1" size="sm" onClick={handleAccept}>
							Accepter
						</Button>
						<Button
							className="flex-1"
							size="sm"
							variant="outline"
							onClick={handleDecline}
						>
							Refuser
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
