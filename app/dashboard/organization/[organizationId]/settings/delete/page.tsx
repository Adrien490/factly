import { getOrganization } from "@/app/dashboard/(with-sidebar)/organizations/server/get-organization";
import { PageContainer } from "@/components/page-container";
import PageHeader from "@/components/page-header";
import DeleteOrganizationForm from "../components/delete-organization-form";

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
}
