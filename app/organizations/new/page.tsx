import PageHeader from "../../../components/page-header";
import OrganizationForm from "../components/organization-form";

export default async function NewOrganizationPage() {
	return (
		<div className="space-y-4">
			<PageHeader
				title="Nouvelle organisation"
				description="Créez une nouvelle organisation"
				breadcrumbs={[
					{ label: "Organisations", href: "/organizations" },
					{ label: "Nouvelle organisation", href: "/organizations/new" },
				]}
			/>
			<OrganizationForm />
		</div>
	);
}
