import { CreateFiscalYearForm } from "@/domains/fiscal-year/features/create-fiscal-year";
import { PageContainer, PageHeader } from "@/shared/components";

export default async function NewFiscalYearPage() {
	return (
		<PageContainer>
			{/* En-tête */}
			<PageHeader
				title="Nouvelle année fiscale"
				description="Créez une nouvelle année fiscale pour votre organisation"
			/>

			{/* Contenu principal */}
			<CreateFiscalYearForm />
		</PageContainer>
	);
}
