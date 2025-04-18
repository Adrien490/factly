import { HorizontalMenu } from "@/shared/components";
import { Badge } from "@/shared/components/shadcn-ui/badge";
import { use } from "react";
import { CLIENT_STATUSES } from "../../constants";
import { CLIENT_TYPES } from "../../constants/client-types";
import { ClientHeaderProps } from "./types";

export function ClientHeader({ clientPromise }: ClientHeaderProps) {
	const client = use(clientPromise);

	const statusInfo = CLIENT_STATUSES.find(
		(option) => option.value === client.status
	);
	const clientTypeInfo = CLIENT_TYPES.find(
		(option) => option.value === client.clientType
	);

	return (
		<div>
			<div className="flex flex-col gap-4">
				{/* Section principale avec nom et identifiants */}
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							{client.name}
						</h1>
						<div className="flex items-center gap-2">
							<Badge
								variant="outline"
								style={{
									backgroundColor: `${statusInfo?.color}20`,
									color: statusInfo?.color,
									borderColor: statusInfo?.color,
								}}
							>
								{statusInfo?.label}
							</Badge>
							<Badge variant="outline" className="bg-primary/5">
								{clientTypeInfo?.label}
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
								label: "Fiche client",
								href: `/dashboard/${client.organizationId}/clients/${client.id}`,
							},
							{
								label: "Modifier",
								href: `/dashboard/${client.organizationId}/clients/${client.id}/edit`,
							},
							{
								label: "Gestion des adresses",
								href: `/dashboard/${client.organizationId}/clients/${client.id}/addresses`,
							},
							{
								label: "Gestion des contacts",
								href: `/dashboard/${client.organizationId}/clients/${client.id}/contacts`,
							},
							{
								label: "Supprimer",
								href: `/dashboard/${client.organizationId}/clients/${client.id}/delete`,
							},
						]}
					/>
				</div>
			</div>
		</div>
	);
}
