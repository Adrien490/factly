import { searchAddress } from "@/domains/address/features/search-address";
import { CreateSupplierForm } from "@/domains/supplier/features/create-supplier";
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

export default async function NewSupplierPage({ searchParams }: PageProps) {
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
				title="Nouveau fournisseur"
				description="Créez un nouveau fournisseur pour votre organisation"
			/>

			{/* Contenu principal */}
			<CreateSupplierForm
				searchAddressPromise={searchAddress(searchAddressParams)}
			/>
		</PageContainer>
	);
}
