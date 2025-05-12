import { searchAddress } from "@/domains/address/features";
import { getOrganization } from "@/domains/organization/features";
import { UpdateOrganizationForm } from "@/domains/organization/features/update-organization/components/update-organization-form";
import { PageContainer, PageHeader } from "@/shared/components";

type Props = {
	params: Promise<{ organizationId: string }>;
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

export default async function EditOrganizationPage({
	params,
	searchParams,
}: Props) {
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

	const organization = await getOrganization({ id: organizationId });

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
			<PageHeader title="Modifier l'organisation" />
			<UpdateOrganizationForm
				searchAddressPromise={searchAddress(searchAddressParams)}
				organization={organization}
			/>
		</PageContainer>
	);
}
