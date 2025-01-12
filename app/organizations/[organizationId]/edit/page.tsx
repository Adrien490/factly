import getOrganization from "@/app/organizations/api/get-organization";
import OrganizationForm from "@/app/organizations/components/organization-form";
import PageHeader from "@/components/page-header";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function EditOrganizationPage({ params }: Props) {
	const resolvedParams = await params;
	const organizationId = resolvedParams.organizationId;
	const organization = await getOrganization(organizationId);

	return (
		<div className="container py-6 space-y-6">
			<PageHeader
				title="Modifier l'organisation"
				description="Modifiez les informations de votre organisation."
				breadcrumbs={[
					{ label: "Organisations", href: "/organizations" },
					{
						label: organization.name,
						href: `/organizations/${organization.id}`,
					},
					{ label: "Modifier", href: `/organizations/${organization.id}/edit` },
				]}
			/>
			<OrganizationForm
				initialValues={{
					name: organization.name,
					siren: organization.siren ?? undefined,
					vatNumber: organization.vatNumber ?? undefined,
					vatOptionDebits: organization.vatOptionDebits ?? false,
					legalForm: organization.legalForm ?? undefined,
					rcsNumber: organization.rcsNumber ?? undefined,
					capital: organization.capital ?? undefined,
					address: organization.address ?? undefined,
					city: organization.city ?? undefined,
					zipCode: organization.zipCode ?? undefined,
					country: organization.country ?? undefined,
					phone: organization.phone ?? undefined,
					email: organization.email ?? undefined,
					website: organization.website ?? undefined,
				}}
			/>
		</div>
	);
}
