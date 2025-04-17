import {
	ClientHeader,
	ClientHeaderSkeleton,
} from "@/domains/client/components/client-header";
import { getClient } from "@/domains/client/features/get-client";
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
		<PageContainer className="pt-4">
			{/* Breadcrumb amélioré */}

			{/* En-tête client */}
			<div className="border-b">
				<div className="pb-6">
					<Suspense fallback={<ClientHeaderSkeleton />}>
						<ClientHeader
							clientPromise={getClient({ id: clientId, organizationId })}
						/>
					</Suspense>
				</div>
			</div>

			{/* Contenu de la page */}
			<div className="py-6">{children}</div>
		</PageContainer>
	);
}
