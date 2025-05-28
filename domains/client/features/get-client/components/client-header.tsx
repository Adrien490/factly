import NotFound from "@/app/not-found";
import {
	CLIENT_STATUS_COLORS,
	CLIENT_STATUS_LABELS,
	CLIENT_TYPE_COLORS,
	CLIENT_TYPE_LABELS,
} from "@/domains/client/constants";
import { CIVILITY_LABELS } from "@/domains/contact/constants/civility-options";
import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/ui/badge";
import { use } from "react";
import { GetClientReturn } from "../types";

interface ClientHeaderProps {
	clientPromise: Promise<GetClientReturn | null>;
}

export function ClientHeader({ clientPromise }: ClientHeaderProps) {
	const client = use(clientPromise);
	if (!client) {
		return <NotFound />;
	}

	const defaultContact = client.contacts[0];

	let displayName = "";
	if (client.type === "COMPANY") {
		displayName = client.company?.name || "";
	} else {
		// Pour les particuliers, inclure la civilité si elle existe
		const civility = defaultContact?.civility
			? CIVILITY_LABELS[defaultContact.civility]
			: "";
		const firstName = defaultContact?.firstName || "";
		const lastName = defaultContact?.lastName || "";

		if (civility) {
			displayName = `${civility} ${firstName} ${lastName}`.trim();
		} else {
			displayName = `${firstName} ${lastName}`.trim();
		}
	}

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{displayName}
						</h1>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								style={{
									backgroundColor: `${CLIENT_STATUS_COLORS[client.status]}20`,
									color: CLIENT_STATUS_COLORS[client.status],
									borderColor: CLIENT_STATUS_COLORS[client.status],
								}}
							>
								{CLIENT_STATUS_LABELS[client.status]}
							</Badge>
							<Badge
								style={{
									backgroundColor: `${CLIENT_TYPE_COLORS[client.type]}20`,
									color: CLIENT_TYPE_COLORS[client.type],
									borderColor: CLIENT_TYPE_COLORS[client.type],
								}}
								variant="outline"
							>
								{CLIENT_TYPE_LABELS[client.type]}
							</Badge>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
						{client.reference && (
							<div className="flex items-center gap-1.5">
								<span className="font-medium">Référence:</span>
								<span>{client.reference}</span>
							</div>
						)}
						{client.reference && (
							<span className="text-muted-foreground/50">•</span>
						)}
						<div className="flex items-center gap-1.5">
							<span className="font-medium">ID:</span>
							<span className="font-mono">{client.id.substring(0, 8)}</span>
						</div>
					</div>
				</div>

				{/* Actions et navigation */}
				<div className="flex flex-wrap gap-3">
					<HorizontalMenu
						items={[
							{
								title: "Fiche client",
								url: `/dashboard/commercial/clients/${client.id}`,
							},
							{
								title: "Modifier",
								url: `/dashboard/commercial/clients/${client.id}/edit`,
							},
							{
								title: "Gestion des adresses",
								url: `/dashboard/commercial/clients/${client.id}/addresses`,
							},
							{
								title: "Gestion des contacts",
								url: `/dashboard/commercial/clients/${client.id}/contacts`,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
