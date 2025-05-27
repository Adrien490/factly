import { searchAddress } from "@/domains/address/features/search-address";
import { CreateCompanyForm } from "@/domains/company";
import { PageContainer, PageHeader } from "@/shared/components";

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

	console.log(searchAddressParams);

	// Recherche d'adresse
	const searchAddressPromise = searchAddress(searchAddressParams);

	return (
		<PageContainer>
			<PageHeader title="Créer une entreprise pour accéder à l'espace de travail" />
			<CreateCompanyForm searchAddressPromise={searchAddressPromise} />
		</PageContainer>
	);
}
