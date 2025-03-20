import CreateClientForm from "@/app/dashboard/[organizationId]/clients/new/components/create-client-form";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { searchAddress } from "@/features/autocomplete/queries/search-address";

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

export default async function NewClientPage({ searchParams }: PageProps) {
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
			{/* En-tête */}
			<PageHeader title="Nouveau client" />

			{/* Contenu principal */}
			<CreateClientForm
				searchAddressPromise={
					q.length >= 3
						? searchAddress(searchAddressParams)
						: Promise.resolve({
								results: [],
								metadata: {
									query: q,
									limit: Number(limit) || 5,
									attribution: "API Adresse (Base Adresse Nationale)",
									licence: "ODbL 1.0",
								},
						  })
				}
			/>
		</PageContainer>
	);
}
