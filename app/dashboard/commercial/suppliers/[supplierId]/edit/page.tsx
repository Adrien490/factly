import NotFound from "@/app/dashboard/not-found";
import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { UpdateSupplierForm } from "@/domains/supplier/features/update-supplier";

type PageProps = {
	params: Promise<{
		supplierId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const { supplierId } = await params;

	const supplier = await getSupplier({ id: supplierId });

	if (!supplier) {
		return <NotFound />;
	}

	return <UpdateSupplierForm supplier={supplier} />;
}
