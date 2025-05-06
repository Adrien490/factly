import { CreateProductForm } from "@/domains/product/features/create-product";
import { getProductNavigation } from "@/domains/product/utils";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

interface NewProductPageProps {
	params: Promise<{
		organizationId: string;
	}>;
}

export default async function NewProductPage({ params }: NewProductPageProps) {
	const { organizationId } = await params;
	return (
		<PageContainer>
			<PageHeader
				title="Nouveau produit"
				description="Créez un nouveau produit"
			/>

			<HorizontalMenu items={getProductNavigation(organizationId)} />

			<CreateProductForm />
		</PageContainer>
	);
}
