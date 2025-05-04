import {
	CLIENT_STATUS_TRANSITIONS,
	CLIENT_STATUSES,
} from "@/domains/client/constants";
import { ArchiveClientButton } from "@/domains/client/features/archive-client";
import { DeleteClientButton } from "@/domains/client/features/delete-client/components/delete-client-button";
import { RestoreClientButton } from "@/domains/client/features/restore-client";
import { UpdateClientStatusButton } from "@/domains/client/features/update-client-status/components/udpate-client-status-button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
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
import {
	Archive,
	Edit2,
	FileText,
	MoreVerticalIcon,
	Pin,
	Tag,
	Trash,
	Undo,
	Users,
} from "lucide-react";
import Link from "next/link";
import { GetClientsReturn } from "../../../types";

interface ClientRowActionsProps {
	client: GetClientsReturn["clients"][number];
}

export function ClientRowActions({ client }: ClientRowActionsProps) {
	const isArchived = client.status === ClientStatus.ARCHIVED;

	return (
		<DropdownMenu>
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
						<FileText className="h-4 w-4 mr-2" />
						<span>Fiche client</span>
						<LoadingIndicator className="ml-auto h-4 w-4 invisible" />
					</Link>
				</DropdownMenuItem>
				{!isArchived && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
								className={cn("flex w-full items-center")}
							>
								<Edit2 className="h-4 w-4 mr-2" />
								<span>Modifier</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`/dashboard/${client.organizationId}/clients/${client.id}/addresses`}
								className={cn("flex w-full items-center")}
							>
								<Pin className="h-4 w-4 mr-2" />
								<span>Gérer les adresses</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`/dashboard/${client.organizationId}/clients/${client.id}/contacts`}
								className={cn("flex w-full items-center")}
							>
								<Users className="h-4 w-4 mr-2" />
								<span>Gérer les contacts</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Tag className="h-4 w-4 mr-2" />
								<span>Changer le statut</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{CLIENT_STATUSES.filter(
									(status) =>
										status.value !== ClientStatus.ARCHIVED &&
										CLIENT_STATUS_TRANSITIONS[client.status].includes(
											status.value
										)
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
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem
									preventDefault
									className="text-destructive focus:text-destructive"
								>
									<Archive className="text-destructive h-4 w-4 mr-2" />
									<span>Archiver</span>
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Archiver le client</AlertDialogTitle>
									<AlertDialogDescription>
										Cette action va archiver le client
										{client.name && <strong> {client.name}</strong>}.
										<br />
										Vous pourrez le restaurer ultérieurement.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<ArchiveClientButton
										organizationId={client.organizationId}
										id={client.id}
									>
										<AlertDialogAction>Archiver</AlertDialogAction>
									</ArchiveClientButton>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
				{isArchived && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Undo className="h-4 w-4 mr-2" />
								<span>Restaurer</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								{CLIENT_STATUSES.filter(
									(status) => status.value !== ClientStatus.ARCHIVED
								).map((status) => (
									<AlertDialog key={status.value}>
										<AlertDialogTrigger asChild>
											<DropdownMenuItem preventDefault>
												<div className="flex items-center gap-2">
													<div
														className="h-2 w-2 rounded-full"
														style={{ backgroundColor: status.color }}
													/>
													<span>{status.label}</span>
												</div>
											</DropdownMenuItem>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Restaurer le client en {status.label.toLowerCase()}
												</AlertDialogTitle>
												<AlertDialogDescription>
													Cette action va restaurer le client
													{client.name && <strong> {client.name}</strong>} en
													statut {status.label.toLowerCase()}.
													<br />
													Cette action est réversible.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Annuler</AlertDialogCancel>
												<RestoreClientButton
													organizationId={client.organizationId}
													id={client.id}
													status={status.value}
												>
													<AlertDialogAction>Restaurer</AlertDialogAction>
												</RestoreClientButton>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								))}
							</DropdownMenuSubContent>
						</DropdownMenuSub>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem
									preventDefault
									className="text-destructive focus:text-destructive"
								>
									<Trash className="text-destructive h-4 w-4 mr-2" />
									<span>Supprimer définitivement</span>
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle className="text-destructive">
										Êtes-vous sûr de vouloir supprimer définitivement ce client
										?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Cette action va supprimer définitivement le client
										{client.name && <strong> {client.name}</strong>}.
										<br />
										Cette action est irréversible.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Annuler</AlertDialogCancel>
									<DeleteClientButton
										organizationId={client.organizationId}
										id={client.id}
									>
										<AlertDialogAction>Supprimer</AlertDialogAction>
									</DeleteClientButton>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
