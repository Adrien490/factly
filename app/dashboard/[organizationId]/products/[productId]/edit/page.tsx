import { getProduct } from "@/domains/product/features";
import { UpdateProductForm } from "@/domains/product/features/update-product/components/update-product-form";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		productId: string;
	}>;
};

export default async function EditProductPage({ params }: PageProps) {
	const { organizationId, productId } = await params;

	const product = await getProduct({ id: productId, organizationId });

	if (!product) {
		return <NotFound />;
	}

	return <UpdateProductForm product={product} />;
}
