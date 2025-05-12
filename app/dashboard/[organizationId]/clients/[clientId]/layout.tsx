import { ClientHeader, getClient } from "@/domains/client/features/get-client";
import { ClientHeaderSkeleton } from "@/domains/client/features/get-client/components/client-header-skeleton";
import { PageContainer } from "@/shared/components";
import { Suspense } from "react";

type Props = {
	children: React.ReactNode;
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function ClientLayout({ children, params }: Props) {
	const { clientId, organizationId } = await params;

	return (
		<PageContainer className="pt-4">
			<Suspense fallback={<ClientHeaderSkeleton />}>
				<ClientHeader
					clientPromise={getClient({ id: clientId, organizationId })}
				/>
			</Suspense>

			{children}
		</PageContainer>
	);
}
