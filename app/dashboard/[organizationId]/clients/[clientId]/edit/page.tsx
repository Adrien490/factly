import { getClient } from "@/domains/client/features/get-client";
import {
	UpdateClientForm,
	UpdateClientFormSkeleton,
} from "@/domains/client/features/update-client";
import { Suspense } from "react";

type PageProps = {
	params: Promise<{
		organizationId: string;
		clientId: string;
	}>;
};

export default async function EditClientPage({ params }: PageProps) {
	const resolvedParams = await params;
	const { organizationId, clientId } = resolvedParams;

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-2xl font-semibold">Modifier le client</h1>
			<Suspense fallback={<UpdateClientFormSkeleton />}>
				<UpdateClientForm
					clientPromise={getClient({ id: clientId, organizationId })}
				/>
			</Suspense>
		</div>
	);
}
