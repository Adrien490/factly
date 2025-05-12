import { ADDRESS_TYPE_OPTIONS } from "@/domains/address/constants";
import {
	Card,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	EmptyState,
} from "@/shared/components";
import { Country } from "@prisma/client";
import { MapPin, MoreHorizontal } from "lucide-react";
import { use } from "react";
import { GetAddressesReturn } from "../types";

interface AddressListProps {
	addressesPromise: Promise<GetAddressesReturn>;
	clientId?: string;
	supplierId?: string;
}

export function AddressList({ addressesPromise }: AddressListProps) {
	// Utilisation du hook use pour résoudre la Promise
	const addresses = use(addressesPromise);

	// Déterminer le contexte (client ou fournisseur) pour les liens d'ajout

	if (addresses.length === 0) {
		return <EmptyState description="Aucune adresse trouvée" />;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
									{[
										postalCode,
										city,
										country !== Country.FRANCE ? country : null,
									]
										.filter(Boolean)
										.join(", ")}
								</p>

								<p className="text-xs mt-1.5 text-muted-foreground">
									{
										ADDRESS_TYPE_OPTIONS.find(
											(type) => type.value === addressType
										)?.label
									}
								</p>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem asChild>Modifier</DropdownMenuItem>
									<DropdownMenuItem asChild>Supprimer</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
