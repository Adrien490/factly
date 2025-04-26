import { getFiscalYearNavigation } from "@/domains/fiscal-year";
import { CreateFiscalYearForm } from "@/domains/fiscal-year/features/create-fiscal-year";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

type PageProps = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function NewFiscalYearPage({ params }: PageProps) {
	const { organizationId } = await params;

	return (
		<PageContainer>
			{/* En-tête */}
			<PageHeader
				title="Nouvelle année fiscale"
				description="Créez une nouvelle année fiscale pour votre organisation"
			/>

			<HorizontalMenu items={getFiscalYearNavigation(organizationId)} />

			{/* Contenu principal */}
			<CreateFiscalYearForm />
		</PageContainer>
	);
}
