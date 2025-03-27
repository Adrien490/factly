import { getOrganization } from "@/features/organization/get";
import { PageContainer } from "@/features/shared/components/page-container";
import { PageHeader } from "@/features/shared/components/page-header";
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
