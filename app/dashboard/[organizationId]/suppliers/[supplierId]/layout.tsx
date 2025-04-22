import { ClientHeaderSkeleton } from "@/domains/client/features/get-client";
import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { SupplierHeader } from "@/domains/supplier/features/get-supplier/components/supplier-header/supplier-header";

import { PageContainer } from "@/shared/components";
import { ReactNode, Suspense } from "react";

type Props = {
	children: ReactNode;
	params: Promise<{
		organizationId: string;
		supplierId: string;
	}>;
};

export default async function SupplierLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const { organizationId, supplierId } = resolvedParams;

	return (
		<PageContainer className="pt-4 pb-12">
			{/* En-tête fournisseur */}
			<Suspense fallback={<ClientHeaderSkeleton />}>
				<SupplierHeader
					supplierPromise={getSupplier({ id: supplierId, organizationId })}
				/>
			</Suspense>

			{/* Contenu de la page */}
			{children}
		</PageContainer>
	);
}
