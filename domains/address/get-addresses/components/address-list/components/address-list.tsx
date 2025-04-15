"use client";

import { GetAddressesReturn } from "@/domains/address";
import { EmptyState } from "@/shared/components";
import { ViewType } from "@/shared/types";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";

import { AddressCard } from "../../address-card/components/address-card";

type AddressListProps = {
	addressesPromise: Promise<GetAddressesReturn>;
	createHref?: string;
};

export function AddressList({
	addressesPromise,
	createHref,
}: AddressListProps) {
	// Résolution de la Promise pour obtenir les adresses
	const addresses = use(addressesPromise);
	const searchParams = useSearchParams();
	const viewMode = (searchParams.get("view") as ViewType) || "grid";

	// Affichage de l'état vide (pas d'adresses)
	if (addresses.length === 0) {
		return (
			<EmptyState
				icon={MapPin}
				title="Aucune adresse trouvée"
				description="Vous pouvez créer une adresse en cliquant sur le bouton ci-dessous"
				action={<Link href={createHref || "#"}>Nouvelle adresse</Link>}
			/>
		);
	}

	// Container adaptatif selon le mode de vue
	const containerClassName =
		viewMode === "grid"
			? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
			: "space-y-3";

	return (
		<div className="relative group-has-data-pending:animate-pulse">
			{/* Animation de transition pour donner un retour visuel lors du changement de vue */}
			<div className={`transition-all duration-300 ${containerClassName}`}>
				{/* Mapping des adresses avec le paramètre view pour adaptation */}
				{addresses.map((address) => (
					<AddressCard key={address.id} address={address} viewMode={viewMode} />
				))}
			</div>
		</div>
	);
}
