import { CreateAddressForm } from "@/domains/address/features/create-address";
import { searchAddress } from "@/domains/address/features/search-address";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";

type Props = {
	params: Promise<{
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

export default async function NewAddressPage({ params, searchParams }: Props) {
	const resolvedParams = await params;
	const { clientId, organizationId } = resolvedParams;

	const resolvedSearchParams = await searchParams;
	const {
		q = "",
		postcode,
		citycode,
		limit,
		type,
		autocomplete,
		lat,
		lon,
	} = resolvedSearchParams;

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
				title="Nouvelle adresse"
				description="Ajoutez une nouvelle adresse pour votre client"
			/>
			<CreateAddressForm
				searchAddressPromise={searchAddress(searchAddressParams)}
				clientId={clientId}
				returnUrl={`/dashboard/${organizationId}/clients/${clientId}`}
			/>
		</PageContainer>
	);
}
