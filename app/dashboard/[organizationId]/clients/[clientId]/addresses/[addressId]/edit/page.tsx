import { getAddress } from "@/domains/address/features";
import { searchAddress } from "@/domains/address/features/search-address";
import { UpdateAddressForm } from "@/domains/address/features/update-address";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{
		addressId: string;
		clientId: string;
		organizationId: string;
	}>;
	searchParams: Promise<{
		q?: string;
		postcode?: string;
		citycode?: string;
		limit?: string;
		type?: "housenumber" | "street" | "locality" | "municipality";
		autocomplete?: string;
		lat?: string;
		lon?: string;
	}>;
};

export default async function EditAddressPage({ params, searchParams }: Props) {
	const { addressId, clientId, organizationId } = await params;

	// Récupérer l'adresse à éditer
	const address = await getAddress({
		organizationId,
		id: addressId,
	});

	// Vérifier que l'adresse existe et appartient au client
	if (!address || address.clientId !== clientId) {
		return notFound();
	}

	const {
		q = "",
		postcode,
		citycode,
		limit,
		type,
		autocomplete,
		lat,
		lon,
	} = await searchParams;

	// Construire les paramètres de recherche
	const searchAddressParams = {
		query: q,
		...(postcode && { postcode }),
		...(citycode && { citycode }),
		...(type && { type }),
		...(limit && { limit: parseInt(limit, 10) }),
		...(autocomplete === "0" && { autocomplete: false }),
		...(lat && { lat: parseFloat(lat) }),
		...(lon && { lon: parseFloat(lon) }),
	};

	return (
		<PageContainer>
			<PageHeader
				title="Modifier une adresse"
				description="Modifiez les informations de l'adresse"
			/>

			<UpdateAddressForm
				address={address}
				searchAddressPromise={searchAddress(searchAddressParams)}
				returnUrl={`/dashboard/${organizationId}/clients/${clientId}`}
			/>
		</PageContainer>
	);
}
