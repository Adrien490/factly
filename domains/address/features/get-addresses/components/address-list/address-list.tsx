import { Card, CardContent } from "@/shared/components";
import { cn } from "@/shared/utils";
import { AddressType } from "@prisma/client";
import { MapPin, PlusCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { ActionMenu } from "./components";
import { AddressListProps } from "./types";

// Fonction utilitaire pour traduire les types d'adresse en français
function getAddressTypeLabel(type: AddressType): string {
	switch (type) {
		case "BILLING":
			return "Facturation";
		case "SHIPPING":
			return "Livraison";
		case "OTHER":
			return "Autre";
		default:
			return "Adresse";
	}
}

export function AddressList({
	viewType = "grid",
	addressesPromise,
	clientId,
	supplierId,
}: AddressListProps) {
	// Utilisation du hook use pour résoudre la Promise
	const addresses = use(addressesPromise);

	// Déterminer le contexte (client ou fournisseur) pour les liens d'ajout
	const baseUrl = clientId
		? `/clients/${clientId}/addresses`
		: `/suppliers/${supplierId}/addresses`;

	return (
		<div className="relative group-has-data-pending:animate-pulse">
			<div
				className={cn(
					"transition-all duration-300",
					viewType === "grid"
						? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
						: "space-y-3"
				)}
			>
				{addresses.map((address) => {
					const {
						id,
						addressType,
						addressLine1,
						addressLine2,
						city,
						postalCode,
						country,
						isDefault,
					} = address;

					if (viewType === "list") {
						return (
							<div key={id} className="block">
								<div className="border rounded-lg p-3 transition-all duration-200 hover:border-primary/50 hover:bg-accent/30">
									<div className="flex items-center gap-3">
										{/* Icône */}
										<div className="h-10 w-10 shrink-0 flex items-center justify-center">
											<div className="h-10 w-10 rounded-md bg-muted/50 flex items-center justify-center">
												<MapPin className="h-5 w-5 text-muted-foreground" />
											</div>
										</div>

										{/* Adresse et détails */}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<h3 className="font-medium truncate">{addressLine1}</h3>
												{isDefault && (
													<span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
														Par défaut
													</span>
												)}
												<span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
													{getAddressTypeLabel(addressType)}
												</span>
											</div>
											<p className="text-xs text-muted-foreground truncate mt-0.5">
												{[addressLine2, postalCode, city, country]
													.filter(Boolean)
													.join(", ")}
											</p>
										</div>

										{/* Menu d'actions */}
										<ActionMenu
											id={id}
											clientId={clientId}
											supplierId={supplierId}
										/>
									</div>
								</div>
							</div>
						);
					}

					// Rendu en mode grille
					return (
						<Card
							key={id}
							className="h-full transition-all duration-200 hover:border-primary/50 hover:bg-accent/30"
						>
							<CardContent className="p-4 flex flex-col h-full">
								<div className="flex items-start gap-3">
									{/* Icône */}
									<div className="h-12 w-12 shrink-0 flex items-center justify-center">
										<div className="h-12 w-12 rounded-md bg-muted/50 flex items-center justify-center">
											<MapPin className="h-6 w-6 text-muted-foreground" />
										</div>
									</div>

									{/* Adresse et badge type */}
									<div className="flex-1 min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<h3 className="font-medium truncate">{addressLine1}</h3>
											{isDefault && (
												<span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
													Par défaut
												</span>
											)}
										</div>
										{addressLine2 && (
											<p className="text-sm text-muted-foreground truncate mt-0.5">
												{addressLine2}
											</p>
										)}
									</div>

									{/* Menu d'actions */}
									<ActionMenu
										id={id}
										clientId={clientId}
										supplierId={supplierId}
									/>
								</div>

								{/* Informations secondaires */}
								<div className="pt-3 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1 mt-2">
									<span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
										{getAddressTypeLabel(addressType)}
									</span>
									<span>{[postalCode, city].filter(Boolean).join(" ")}</span>
									{country && country !== "France" && <span>{country}</span>}
								</div>
							</CardContent>
						</Card>
					);
				})}

				{addresses.length === 0 && (
					<Link
						href={`${baseUrl}/new`}
						className={`block ${viewType === "grid" ? "h-full" : ""}`}
					>
						<div
							className={`
								border border-dashed rounded-lg flex items-center justify-center 
								text-muted-foreground hover:text-primary hover:border-primary 
								transition-colors
								${viewType === "grid" ? "h-full p-6 flex-col" : "p-4 flex-row"}
							`}
						>
							<PlusCircle
								className={
									viewType === "grid" ? "h-10 w-10 mb-2" : "h-5 w-5 mr-2"
								}
							/>
							<span>
								{viewType === "grid"
									? "Ajouter une adresse"
									: "Nouvelle adresse"}
							</span>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
}
