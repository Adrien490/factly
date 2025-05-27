import { getFiscalYear } from "@/domains/fiscal-year/features/get-fiscal-year";
import {
	FiscalYearHeader,
	FiscalYearHeaderSkeleton,
} from "@/domains/fiscal-year/features/get-fiscal-year/components";
import { PageContainer } from "@/shared/components";
import { ReactNode, Suspense } from "react";

type Props = {
	children: ReactNode;
	params: Promise<{
		fiscalYearId: string;
	}>;
};

export default async function ClientLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const { fiscalYearId } = resolvedParams;

	return (
		<PageContainer className="pt-4 pb-12">
			{/* Breadcrumb amélioré */}

			{/* En-tête client */}

			<Suspense fallback={<FiscalYearHeaderSkeleton />}>
				<FiscalYearHeader
					fiscalYearPromise={getFiscalYear({
						id: fiscalYearId,
					})}
				/>
			</Suspense>

			{/* Contenu de la page */}
			{children}
		</PageContainer>
	);
}
