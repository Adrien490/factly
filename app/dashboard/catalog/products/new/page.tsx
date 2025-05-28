import { CreateProductForm } from "@/domains/product/features/create-product";
import { getProductNavigation } from "@/domains/product/utils";
import { HorizontalMenu, PageContainer, PageHeader } from "@/shared/components";

export default async function NewProductPage() {
	return (
		<PageContainer>
			<PageHeader
				title="Nouveau produit"
				description="Créez un nouveau produit"
			/>

			<HorizontalMenu items={getProductNavigation()} />

			<CreateProductForm />
		</PageContainer>
	);
}
