import { ClientHeaderSkeleton } from "@/domains/client/features/get-client/components/client-header-skeleton";
import { getSupplier } from "@/domains/supplier/features/get-supplier";
import { SupplierHeader } from "@/domains/supplier/features/get-supplier/components/supplier-header";

import { PageContainer } from "@/shared/components";
import { ReactNode, Suspense } from "react";

type Props = {
	children: ReactNode;
	params: Promise<{
		supplierId: string;
	}>;
};

export default async function SupplierLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const { supplierId } = resolvedParams;

	return (
		<PageContainer className="pt-4 pb-12">
			{/* En-tête fournisseur */}
			<Suspense fallback={<ClientHeaderSkeleton />}>
				<SupplierHeader supplierPromise={getSupplier({ id: supplierId })} />
			</Suspense>

			{/* Contenu de la page */}
			{children}
		</PageContainer>
	);
}
