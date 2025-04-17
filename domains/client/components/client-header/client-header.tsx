import { NavigationDropdown } from "@/shared/components";
import { Badge } from "@/shared/components/shadcn-ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";
import { getClientNavigation } from "../../constants";
import { ClientHeaderProps } from "./types";

export function ClientHeader({ clientPromise }: ClientHeaderProps) {
	const client = use(clientPromise);

	if (!client) {
		notFound();
	}

	const clientNavigation = getClientNavigation(
		client.organizationId,
		client.id
	);

	return (
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
				<NavigationDropdown items={clientNavigation} />
			</div>
		</div>
	);
}
