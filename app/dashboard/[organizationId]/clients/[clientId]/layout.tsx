import { getClient } from "@/domains/client/features/get-client";
import {
	ClientHeader,
	ClientHeaderSkeleton,
} from "@/domains/client/features/get-client/components/client-header";
import { PageContainer } from "@/shared/components";
import { ReactNode, Suspense } from "react";

type Props = {
	children: ReactNode;
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientLayout({ children, params }: Props) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	return (
		<PageContainer className="pt-4 pb-12">
			{/* Breadcrumb amélioré */}

			{/* En-tête client */}

			<Suspense fallback={<ClientHeaderSkeleton />}>
				<ClientHeader
					clientPromise={getClient({ id: clientId, organizationId })}
				/>
			</Suspense>

			{/* Contenu de la page */}
			{children}
		</PageContainer>
	);
}
