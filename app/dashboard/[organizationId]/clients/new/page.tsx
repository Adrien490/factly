import { searchAddress } from "@/domains/address/features/search-address";
import { getClientNavigation } from "@/domains/client/constants";
import { CreateClientForm } from "@/domains/client/features/create-client";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

type PageProps = {
	params: Promise<{
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

export default async function NewClientPage({
	params,
	searchParams,
}: PageProps) {
	const { organizationId } = await params;
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
			{/* En-tête */}
			<PageHeader
				title="Nouveau client"
				description="Créez un nouveau client pour votre organisation"
			/>

			<HorizontalMenu items={getClientNavigation(organizationId)} />

			{/* Contenu principal */}
			<CreateClientForm
				searchAddressPromise={searchAddress(searchAddressParams)}
			/>
		</PageContainer>
	);
}
