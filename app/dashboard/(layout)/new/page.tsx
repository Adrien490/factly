import PageContainer from "@/components/page-container";
import OrganizationForm from "@/features/organizations/components/organization-form";

export default async function NewOrganizationPage() {
	return (
		<PageContainer className="pb-12">
			<OrganizationForm />
		</PageContainer>
	);
}
