import {
	ClientHeader,
	ClientHeaderSkeleton,
} from "@/domains/client/components/client-header";
import { getClient } from "@/domains/client/features/get-client";
import { PageContainer } from "@/shared/components";
import { Separator } from "@/shared/components/shadcn-ui/separator";
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
		<PageContainer className="space-y-8">
			{/* En-tête amélioré avec Suspense */}
			<Suspense fallback={<ClientHeaderSkeleton />}>
				<ClientHeader
					clientPromise={getClient({ id: clientId, organizationId })}
				/>
			</Suspense>

			<Separator />

			{/* Contenu de la page */}
			<div>{children}</div>
		</PageContainer>
	);
}
