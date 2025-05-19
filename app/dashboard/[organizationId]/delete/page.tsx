import { SoftDeleteOrganizationAlertDialog } from "@/domains/organization/features/soft-delete-organization";
import { PageContainer, PageHeader } from "@/shared/components";

interface DeleteOrganizationPageProps {
	params: Promise<{ organizationId: string }>;
}

export default async function DeleteOrganizationPage({
	params,
}: DeleteOrganizationPageProps) {
	const { organizationId } = await params;

	return (
		<PageContainer>
			<PageHeader title="Supprimer une organisation" />
			<SoftDeleteOrganizationAlertDialog id={organizationId} />
		</PageContainer>
	);
}
