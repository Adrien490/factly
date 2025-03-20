import OrganizationForm from "@/app/dashboard/(layout)/new/components/organization-form";
import PageContainer from "@/components/page-container";

export default async function NewOrganizationPage() {
	return (
		<PageContainer className="pb-12">
			<OrganizationForm />
		</PageContainer>
	);
}
