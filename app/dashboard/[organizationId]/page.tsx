import { PageContainer, PageHeader } from "@/shared/components";

type Props = {
	params: Promise<{
		organizationId: string;
	}>;
};

export default async function DashboardPage({ params }: Props) {
	const { organizationId } = await params;
	console.log(organizationId);

	return (
		<PageContainer className="space-y-6">
			<PageHeader
				title="Tableau de bord"
				description="Aperçu de votre activité commerciale"
				className="mb-6"
			/>

			<div className="rounded-lg border bg-card shadow-sm p-8 flex flex-col items-center justify-center min-h-[50vh]">
				<div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-secondary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-secondary-foreground"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" />
						<path d="M7 10h10" />
						<path d="M7 14h10" />
						<path d="M7 18h10" />
					</svg>
				</div>

				<div className="text-center max-w-md">
					<h1 className="text-2xl font-bold text-card-foreground mb-3">
						Bienvenue sur votre tableau de bord
					</h1>
					<p className="text-muted-foreground">
						Nous travaillons actuellement à l&apos;amélioration de cette
						interface pour vous offrir des statistiques et informations
						pertinentes sur votre activité.
					</p>
				</div>
			</div>
		</PageContainer>
	);
}
