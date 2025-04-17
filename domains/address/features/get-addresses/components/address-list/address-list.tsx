import { ADDRESS_TYPES } from "@/domains/address/constants/address-types";
import { Card } from "@/shared/components";
import { cn } from "@/shared/utils";
import { MapPin, PlusIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { ActionMenu } from "./components";
import { AddressListProps } from "./types";

// Fonction utilitaire pour traduire les types d'adresse en françai

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

	if (addresses.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed mb-3">
					<MapPin className="h-5 w-5 text-muted-foreground" />
				</div>
				<h3 className="font-medium mb-1">Aucune adresse</h3>
				<p className="text-sm text-muted-foreground mb-4">
					Ajoutez votre première adresse
				</p>
				<Link
					href={`${baseUrl}/new`}
					className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
				>
					<PlusIcon className="h-4 w-4" />
					Ajouter une adresse
				</Link>
			</div>
		);
	}

	return (
		<div
			className={cn(
				viewType === "grid"
					? "grid grid-cols-1 md:grid-cols-2 gap-3"
					: "space-y-2"
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

				// Version simplifiée et standard pour les deux modes d'affichage
				return (
					<Card key={id} className="p-3">
						<div className="flex items-start gap-2">
							<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />

							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-center gap-1.5 mb-0.5">
									<p className="text-sm font-medium">{addressLine1}</p>
									{isDefault && (
										<span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
											Par défaut
										</span>
									)}
								</div>

								{addressLine2 && (
									<p className="text-xs text-muted-foreground">
										{addressLine2}
									</p>
								)}

								<p className="text-xs text-muted-foreground mt-0.5">
									{[postalCode, city, country !== "France" ? country : null]
										.filter(Boolean)
										.join(", ")}
								</p>

								<p className="text-xs mt-1.5 text-muted-foreground">
									{
										ADDRESS_TYPES.find((type) => type.value === addressType)
											?.label
									}
								</p>
							</div>

							<ActionMenu id={id} clientId={clientId} supplierId={supplierId} />
						</div>
					</Card>
				);
			})}
			{addresses.length > 0 && (
				<Link
					href={`${baseUrl}/new`}
					className="border border-dashed rounded-md p-3 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
				>
					<PlusIcon className="h-4 w-4 mr-1.5" />
					<span className="text-sm">Ajouter une adresse</span>
				</Link>
			)}
		</div>
	);
}
