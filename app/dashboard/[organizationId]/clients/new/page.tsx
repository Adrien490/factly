import { searchAddress } from "@/features/address-api/queries/search-address";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { CreateClientForm } from "./components/create-client-form";

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
	searchParams,
	params,
}: PageProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
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
			<PageHeader
				title="Nouveau client"
				description="Créez un nouveau client pour votre organisation"
				navigation={{
					items: [
						{
							label: "Liste des clients",
							href: `/dashboard/${organizationId}/clients`,
						},
						{
							label: "Nouveau client",
							href: `/dashboard/${organizationId}/clients/new`,
						},
					],
				}}
			/>
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
