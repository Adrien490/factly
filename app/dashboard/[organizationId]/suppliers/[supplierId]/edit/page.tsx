import { getSupplier } from "@/domains/supplier/features/get-supplier";
import {
	UpdateSupplierForm,
	UpdateSupplierFormSkeleton,
} from "@/domains/supplier/features/update-supplier";
import { PageContainer, PageHeader } from "@/shared/components";
import { Suspense } from "react";
import NotFound from "../../../not-found";

type PageProps = {
	params: Promise<{
		organizationId: string;
		supplierId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, supplierId } = resolvedParams;

	const supplier = await getSupplier({ id: supplierId, organizationId });

	if (!supplier) {
		return <NotFound />;
	}

	return (
		<PageContainer>
			{/* En-tête */}

			<PageHeader
				title={`Modifier le fournisseur`}
				description="Modifiez les informations du fournisseur ci-dessous"
			/>
			<Suspense fallback={<UpdateSupplierFormSkeleton />}>
				<UpdateSupplierForm supplier={supplier} />
			</Suspense>
		</PageContainer>
	);
}
