import { PageContainer } from "@/components/page-container";
import PageHeader from "@/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction } from "lucide-react";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function MembersPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	return (
		<PageContainer>
			<PageHeader
				title="Gestion des membres"
				description="Gestion des membres de l'organisation."
				breadcrumbs={[
					{
						label: "Paramètres",
						href: `/organizations/${organizationId}/settings`,
					},
					{
						label: "Gestion des membres",
						href: `/organizations/${organizationId}/settings/members`,
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
}
