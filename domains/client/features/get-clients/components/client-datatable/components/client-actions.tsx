import {
	CLIENT_STATUS_TRANSITIONS,
	CLIENT_STATUSES,
} from "@/domains/client/constants";
import { ArchiveClientAlertDialog } from "@/domains/client/features/archive-client/components/archive-client-alert-dialog";
import { UpdateClientStatusButton } from "@/domains/client/features/update-client-status/components/udpate-client-status-button";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	LoadingIndicator,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { ClientStatus } from "@prisma/client";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { GetClientsReturn } from "../../../types";

interface ClientActionsProps {
	client: GetClientsReturn["clients"][number];
}

export function ClientActions({ client }: ClientActionsProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8 rounded-full hover:bg-muted focus-visible:bg-muted"
					)}
					aria-label="Menu d'actions"
					type="button"
				>
					<MoreVerticalIcon className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				sideOffset={4}
				className="w-48"
			>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}`}
						className={cn("flex w-full items-center")}
					>
						Fiche client
						<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
						className={cn("flex w-full items-center")}
					>
						<span>Modifier</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/addresses`}
						className={cn("flex w-full items-center")}
					>
						<span>Gérer les adresses</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/contacts`}
						className={cn("flex w-full items-center")}
					>
						<span>Gérer les contacts</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Changer le statut</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{CLIENT_STATUSES.filter(
							(status) =>
								status.value !== ClientStatus.ARCHIVED &&
								CLIENT_STATUS_TRANSITIONS[client.status].includes(status.value)
						).map((status) => (
							<UpdateClientStatusButton
								key={status.value}
								organizationId={client.organizationId}
								id={client.id}
								status={status.value}
							>
								<DropdownMenuItem>
									<div className="flex items-center gap-2">
										<div
											className="h-2 w-2 rounded-full"
											style={{ backgroundColor: status.color }}
										/>
										<span>{status.label}</span>
									</div>
								</DropdownMenuItem>
							</UpdateClientStatusButton>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem
					preventDefault
					className="text-destructive focus:text-destructive p-0"
				>
					<ArchiveClientAlertDialog
						organizationId={client.organizationId}
						id={client.id}
					>
						<span className="w-full text-left px-2 py-1.5">Archiver</span>
					</ArchiveClientAlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
