export default async function ProductPage({
	params,
}: {
	params: Promise<{ productId: string }>;
}) {
	const { productId } = await params;
	console.log(productId);
	return <div>ProductPage</div>;
}
