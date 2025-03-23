import { CreateOrganizationForm } from "@/features/organizations/create/components/form";
import { PageContainer } from "@/shared/components/page-container";

export default async function NewOrganizationPage() {
	return (
		<PageContainer>
			<CreateOrganizationForm />
		</PageContainer>
	);
}
