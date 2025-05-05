import { getProductCategoryNavigation } from "@/domains/product-category";
import { CreateProductCategorySheetForm } from "@/domains/product-category/features/create-product-category";
import { getProductCategories } from "@/domains/product-category/features/get-product-categories";
import {
	HorizontalMenu,
	PageContainer,
	PageHeader,
	SearchForm,
	Toolbar,
} from "@/shared/components";
import { Suspense } from "react";

interface Props {
	params: Promise<{
		organizationId: string;
	}>;
}

export default async function ProductsCategoriesPage({ params }: Props) {
	const { organizationId } = await params;

	return (
		<PageContainer>
			<PageHeader
				title="Catégories"
				description="Gérer vos catégories de produits"
			/>

			<HorizontalMenu items={getProductCategoryNavigation(organizationId)} />

			<Toolbar
				leftContent={
					<>
						<SearchForm
							paramName="search"
							placeholder="Rechercher une catégorie..."
							className="flex-1 shrink-0"
						/>
					</>
				}
				rightContent={
					<>
						<Suspense fallback={<></>}>
							<CreateProductCategorySheetForm
								categoriesPromise={getProductCategories({
									organizationId,
									filters: {},
									search: "",
								})}
							/>
						</Suspense>
					</>
				}
			/>
		</PageContainer>
	);
}
