import { searchAddress } from "@/domains/address/features";
import { getCompany } from "@/domains/company";
import { UpdateCompanyForm } from "@/domains/company/features/update-company";
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

export default async function EditCompanyPage({ searchParams }: Props) {
	const company = await getCompany();

	if (!company) {
		throw new Error("Entreprise non trouvée");
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

	return (
		<PageContainer>
			<PageHeader title="Modifier l'organisation" />
			<UpdateCompanyForm
				company={company}
				searchAddressPromise={searchAddress(searchAddressParams)}
			/>
		</PageContainer>
	);
}
