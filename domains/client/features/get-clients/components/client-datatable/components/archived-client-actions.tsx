import { CLIENT_STATUSES } from "@/domains/client/constants";
import { DeleteClientAlertDialog } from "@/domains/client/features/delete-client/components/delete-client-alert-dialog";
import { RestoreClientAlertDialog } from "@/domains/client/features/restore-client/components/restore-client-alert-dialog";
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

interface ArchivedClientActionsProps {
	client: GetClientsReturn["clients"][number];
}

export function ArchivedClientActions({ client }: ArchivedClientActionsProps) {
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
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<span>Restaurer</span>
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						{CLIENT_STATUSES.filter(
							(status) => status.value !== ClientStatus.ARCHIVED
						).map((status) => (
							<DropdownMenuItem
								className="p-0"
								preventDefault
								key={status.value}
							>
								<RestoreClientAlertDialog
									status={status}
									name={client.name}
									organizationId={client.organizationId}
									id={client.id}
								>
									<div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer w-full">
										<div
											className="h-2 w-2 rounded-full"
											style={{ backgroundColor: status.color }}
										/>
										<span>{status.label}</span>
									</div>
								</RestoreClientAlertDialog>
							</DropdownMenuItem>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					preventDefault
				>
					<DeleteClientAlertDialog
						name={client.name}
						organizationId={client.organizationId}
						id={client.id}
					>
						<span>Supprimer définitivement</span>
					</DeleteClientAlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
