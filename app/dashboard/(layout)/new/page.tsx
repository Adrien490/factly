import { searchAddress } from "@/features/addresses";
import { CreateOrganizationForm } from "@/features/organizations/create/components/form";
import { PageContainer } from "@/shared/components/page-container";

type Props = {
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

export default async function NewOrganizationPage({ searchParams }: Props) {
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
			<CreateOrganizationForm
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
