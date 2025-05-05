import { ClientHeader, getClient } from "@/domains/client/features/get-client";
import { PageContainer } from "@/shared/components";

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
		<PageContainer className="pt-4 pb-12">
			<ClientHeader
				clientPromise={getClient({ id: clientId, organizationId })}
			/>
			{children}
		</PageContainer>
	);
}
