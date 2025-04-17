import { Badge } from "@/shared/components/shadcn-ui/badge";
import { Button } from "@/shared/components/shadcn-ui/button";
import { FileEdit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { CLIENT_STATUSES } from "../../constants";
import { CLIENT_TYPES } from "../../constants/client-types";
import { ClientHeaderProps } from "./types";

export function ClientHeader({ clientPromise }: ClientHeaderProps) {
	const client = use(clientPromise);

	if (!client) {
		notFound();
	}

	const statusInfo = CLIENT_STATUSES.find(
		(option) => option.value === client.status
	);

	return (
		<div>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
								{
									CLIENT_TYPES.find(
										(option) => option.value === client.clientType
									)?.label
								}
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
				<div className="flex-shrink-0">
					<div className="flex items-center gap-2">
						<Button asChild variant="outline" size="sm">
							<Link
								href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
							>
								<FileEdit className="h-3.5 w-3.5 mr-1.5" />
								Modifier
							</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Affichage conditionnel des notes */}
			{client.notes && (
				<div className="mt-4 pt-4 border-t border-border/50">
					<div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
						<p className="italic">{client.notes}</p>
					</div>
				</div>
			)}
		</div>
	);
}
