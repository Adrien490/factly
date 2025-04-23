import { getClientNavigation } from "@/domains/client/constants";
import { CreateFiscalYearForm } from "@/domains/fiscal-year/features/create-fiscal-year";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

type PageProps = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function NewFiscalYearPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;

	return (
		<PageContainer>
			{/* En-tête */}
			<PageHeader
				title="Nouveau client"
				description="Créez un nouveau client pour votre organisation"
			/>

			<HorizontalMenu items={getClientNavigation(organizationId)} />

			{/* Contenu principal */}
			<CreateFiscalYearForm />
		</PageContainer>
	);
}
