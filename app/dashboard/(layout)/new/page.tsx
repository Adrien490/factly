import { PageContainer } from "@/shared/components/page-container";
import OrganizationForm from "./components/organization-form";

export default async function NewOrganizationPage() {
	return (
		<PageContainer>
			<OrganizationForm />
		</PageContainer>
	);
}
