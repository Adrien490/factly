import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { UpdateSupplierForm } from "@/domains/supplier/features/update-supplier";
import { PageContainer, PageHeader } from "@/shared/components";
import { Suspense } from "react";

type PageProps = {
	params: Promise<{
		organizationId: string;
		supplierId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, supplierId } = resolvedParams;

	return (
		<PageContainer>
			{/* En-tête */}

			<PageHeader
				title={`Modifier le fournisseur`}
				description="Modifiez les informations du fournisseur ci-dessous"
			/>
			<Suspense fallback={<div>Loading...</div>}>
				<UpdateSupplierForm
					supplierPromise={getSupplier({ id: supplierId, organizationId })}
				/>
			</Suspense>
		</PageContainer>
	);
}
