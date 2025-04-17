import { getClient } from "@/domains/client/features/get-client";
import { NavigationDropdown, PageContainer } from "@/shared/components";
import { Badge } from "@/shared/components/shadcn-ui/badge";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { clientNavigation } from "./constants";

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

	const client = await getClient({ id: clientId, organizationId });

	if (!client) {
		return notFound();
	}

	return (
		<PageContainer className="space-y-8">
			{/* En-tête amélioré */}
			<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{client.name}
						</h1>
						<Badge variant="outline" className="bg-primary/10">
							Client
						</Badge>
					</div>

					<div className="flex items-center gap-3 text-sm text-muted-foreground">
						<span>Référence: {client.reference || "-"}</span>
						<span>•</span>
						<span>ID: {client.id.substring(0, 8)}</span>
					</div>

					<div className="flex flex-wrap gap-3 mt-1">
						{client.email && (
							<div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
								<Mail className="h-3.5 w-3.5" />
								<span>{client.email}</span>
							</div>
						)}
						{client.phone && (
							<div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
								<Phone className="h-3.5 w-3.5" />
								<span>{client.phone}</span>
							</div>
						)}
						{client.createdAt && (
							<div className="inline-flex items-center gap-1 text-sm text-muted-foreground">
								<Clock className="h-3.5 w-3.5" />
								<span>
									Créé le{" "}
									{format(new Date(client.createdAt), "d MMMM yyyy", {
										locale: fr,
									})}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="sticky top-0 z-10 bg-background pb-2 flex-shrink-0">
					<NavigationDropdown
						items={clientNavigation(organizationId, clientId)}
					/>
				</div>
			</div>

			<Separator />

			{/* Contenu de la page */}
			<div>{children}</div>
		</PageContainer>
	);
}
