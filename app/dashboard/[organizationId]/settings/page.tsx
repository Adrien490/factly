import { NotFound } from "@/components/not-found";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { getOrganization } from "@/features/organizations/queries/get-organization";
import { Building2 } from "lucide-react";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function SettingsPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	try {
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
			</PageContainer>
		);
	} catch (error: unknown) {
		return (
			<NotFound
				title={error instanceof Error ? error.message : "Erreur"}
				description="Désolé, nous n'avons pas trouvé l'organisation que vous recherchez."
				actions={[
					{
						label: "Retour aux organisations",
						href: "/dashboard/organizations",
						icon: <Building2 className="size-4" />,
						variant: "outline",
					},
				]}
			/>
		);
	}
}
