import { getOrganization } from "@/domains/organization/features/get-organization";
import { PageContainer, PageHeader } from "@/shared/components";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SettingsPage({ params }: Props) {
	const { organizationId } = await params;

	const organization = await getOrganization(organizationId);
	console.log(organization);
	return (
		<PageContainer>
			<PageHeader
				title="Informations générales"
				description="Modifiez les informations de votre organisation."
			/>
		</PageContainer>
	);
}
