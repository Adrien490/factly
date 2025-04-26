import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { UpdateSupplierForm } from "@/domains/supplier/features/update-supplier";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		supplierId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const { organizationId, supplierId } = await params;

	const supplier = await getSupplier({ id: supplierId, organizationId });

	if (!supplier) {
		return <NotFound />;
	}

	return <UpdateSupplierForm supplier={supplier} />;
}
