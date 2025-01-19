import { PageContainer } from "@/components/page-container";
import PageHeader from "@/components/page-header";
import OrganizationForm from "../../../(with-sidebar)/organizations/components/organization-form";
import { getOrganization } from "../../../(with-sidebar)/organizations/server/get-organization";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SettingsPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const organization = await getOrganization(organizationId);

	return (
		<PageContainer>
			<PageHeader
				title="Informations générales"
				description="Modifiez les informations de votre organisation."
				breadcrumbs={[
					{ label: "Organisations", href: "/dashboard/organizations" },
					{
						label: organization.name,
						href: `/dashboard/organizations/${organization.id}/settings`,
					},
					{
						label: "Paramètres",
						href: `/dashboard/organizations/${organization.id}/settings`,
					},
				]}
			/>
			<OrganizationForm organization={organization} />
		</PageContainer>
	);
}
