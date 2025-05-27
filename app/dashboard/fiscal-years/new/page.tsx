import { getFiscalYearNavigation } from "@/domains/fiscal-year";
import { CreateFiscalYearForm } from "@/domains/fiscal-year/features/create-fiscal-year";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

export default async function NewFiscalYearPage() {
	return (
		<PageContainer>
			{/* En-tête */}
			<PageHeader
				title="Nouvelle année fiscale"
				description="Créez une nouvelle année fiscale pour votre organisation"
			/>

			<HorizontalMenu items={getFiscalYearNavigation()} />

			{/* Contenu principal */}
			<CreateFiscalYearForm />
		</PageContainer>
	);
}
