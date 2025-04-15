import {
	Alert,
	AlertDescription,
	AlertTitle,
	PageContainer,
	PageHeader,
} from "@/shared/components";
import { Construction } from "lucide-react";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function MembersPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	console.log(organizationId);
	try {
		return (
			<PageContainer>
				<PageHeader
					title="Gestion des membres"
					description="Gestion des membres de l'organisation."
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
		console.error(error);
	}
}
