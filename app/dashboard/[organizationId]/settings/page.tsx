import { getOrganization } from "@/features/organization/get";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SettingsPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	try {
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
	} catch (error: unknown) {
		console.error(error);
		return <></>;
	}
}
