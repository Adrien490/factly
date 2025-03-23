import { countClients } from "@/features/clients/count";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function DashboardPage({ params }: Props) {
	const resolvedParams = await params;
	const { organizationId } = resolvedParams;
	const { count } = await countClients({
		organizationId,
		filters: {},
		search: "",
	});

	return (
		<PageContainer>
			<PageHeader title="Tableau de bord" />
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<p className="text-sm text-gray-500">Nombre de clients</p>
					<p className="text-2xl font-bold">{count}</p>
				</div>
			</div>
		</PageContainer>
	);
}
