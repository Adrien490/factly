import {
	ProductHeader,
	getProduct,
} from "@/domains/product/features/get-product";
import { ProductHeaderSkeleton } from "@/domains/product/features/get-product/components/product-header-skeleton";
import { PageContainer } from "@/shared/components";
import { Suspense } from "react";

type Props = {
	children: React.ReactNode;
	params: Promise<{
		organizationId: string;
		productId: string;
	}>;
};

export default async function ProductLayout({ children, params }: Props) {
	const { productId, organizationId } = await params;

	return (
		<PageContainer className="pt-4 pb-12">
			<Suspense fallback={<ProductHeaderSkeleton />}>
				<ProductHeader
					productPromise={getProduct({ id: productId, organizationId })}
				/>
			</Suspense>

			{children}
		</PageContainer>
	);
}
