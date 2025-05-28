import { searchAddress } from "@/domains/address/features/search-address";
import { CreateClientForm } from "@/domains/client/features/create-client";
import { PageContainer, PageHeader } from "@/shared/components";

type PageProps = {
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

export default async function NewClientPage({ searchParams }: PageProps) {
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

	return (
		<PageContainer>
			{/* En-tête */}
			<PageHeader
				title="Nouveau client"
				description="Créez un nouveau client pour votre organisation"
			/>

			{/* Contenu principal */}
			<CreateClientForm
				searchAddressPromise={searchAddress({
					query: q,
					...(postcode && { postcode }),
					...(citycode && { citycode }),
					...(type && { type }),
					...(limit && { limit: parseInt(limit, 10) }),
					...(autocomplete === "0" && { autocomplete: false }),
					...(lat && { lat: parseFloat(lat) }),
					...(lon && { lon: parseFloat(lon) }),
				})}
			/>
		</PageContainer>
	);
}
