import { DeleteOrganizationForm } from "@/domains/organization/features/delete-organization";
import { getOrganization } from "@/domains/organization/features/get-organization";
import { PageContainer, PageHeader } from "@/shared/components";

interface DeleteOrganizationPageProps {
	params: Promise<{
		organizationId: string;
	}>;
}

export default async function DeleteOrganizationPage({
	params,
}: DeleteOrganizationPageProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	try {
		const organization = await getOrganization(organizationId);
		return (
			<PageContainer>
				<PageHeader
					title="Supprimer l'organisation"
					description="Supprimer définitivement cette organisation et toutes ses données"
				/>

				<DeleteOrganizationForm organization={organization} />
			</PageContainer>
		);
	} catch (error: unknown) {
		console.error(error);
		return <></>;
	}
}
