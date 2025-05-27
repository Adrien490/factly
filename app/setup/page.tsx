import { searchAddress } from "@/domains/address/features/search-address";
import { auth } from "@/domains/auth";
import { CreateCompanyForm, getCompany } from "@/domains/company";
import {
	PageContainer,
	PageHeader,
	UserAvatar,
	UserAvatarSkeleton,
} from "@/shared/components";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
	const company = await getCompany();
	if (company) {
		redirect("/dashboard");
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

	// Recherche d'adresse
	const searchAddressPromise = searchAddress(searchAddressParams);

	return (
		<PageContainer>
			<PageHeader
				title="Créer votre entreprise"
				description="Renseignez les informations de votre entreprise pour accéder au tableau de bord"
			/>

			{/* User dropdown positionné en haut à droite */}
			<div className="absolute top-4 right-4 z-50">
				<Suspense fallback={<UserAvatarSkeleton />}>
					<UserAvatar
						size="sm"
						userPromise={auth.api
							.getSession({ headers: await headers() })
							.then((session) => session?.user ?? null)}
					/>
				</Suspense>
			</div>

			{/* Formulaire */}
			<CreateCompanyForm searchAddressPromise={searchAddressPromise} />
		</PageContainer>
	);
}
