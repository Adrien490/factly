import { NotFound } from "@/components/not-found";
import PageContainer from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getOrganization } from "@/features/organizations/queries/get-organization";
import { Construction } from "lucide-react";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function MembersPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	try {
		const organization = await getOrganization(organizationId);

		return (
			<PageContainer>
				<PageHeader
					title="Gestion des membres"
					description="Gestion des membres de l'organisation."
					breadcrumbs={[
						{
							label: "Organisations",
							href: "/dashboard/organizations",
						},
						{
							label: organization.name,
							href: `/dashboard/organizations/${organizationId}`,
						},
						{
							label: "Paramètres",
							href: `/dashboard/organizations/${organizationId}/settings`,
						},
						{
							label: "Gestion des membres",
							href: `/dashboard/organizations/${organizationId}/settings/members`,
						},
					]}
				/>

				<Alert>
					<Construction className="size-4" />
					<AlertTitle>Page en construction</AlertTitle>
					<AlertDescription>
						Cette fonctionnalité est en cours de développement et sera bientôt
						disponible.
					</AlertDescription>
				</Alert>
			</PageContainer>
		);
	} catch (error) {
		const errorCode = error instanceof Error ? error.message : "500";
		const title = errorCode === "404" ? "Organisation non trouvée" : "Erreur";
		return <NotFound title={title} errorCode={errorCode} />;
	}
}
