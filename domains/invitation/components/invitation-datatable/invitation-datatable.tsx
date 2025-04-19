import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	EmptyState,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
	CalendarCheck,
	CalendarX,
	Clock,
	Edit2,
	Mail,
	MoreVerticalIcon,
	Search,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

import { cn } from "@/shared/utils";
import { InvitationStatus } from "@prisma/client";
import { toast } from "sonner";
import { INVITATION_STATUSES } from "../../features/get-invitation-statuses";
import { InvitationDataTableProps } from "./types";

export function InvitationDataTable({
	invitationsPromise,
}: InvitationDataTableProps) {
	const invitations = use(invitationsPromise);

	if (invitations.length === 0) {
		return (
			<div className="py-12" role="status" aria-live="polite">
				<EmptyState
					icon={<Search className="w-10 h-10" />}
					title="Aucune invitation trouvée"
					description="Aucune invitation ne correspond à vos critères."
					className="group-has-[[data-pending]]:animate-pulse"
				/>
			</div>
		);
	}

	return (
		<Table className="group-has-[[data-pending]]:animate-pulse">
			<TableHeader>
				<TableRow>
					<TableHead key="email" role="columnheader">
						Destinataire
					</TableHead>
					<TableHead key="status" role="columnheader">
						Statut
					</TableHead>
					<TableHead key="dates" role="columnheader">
						Dates
					</TableHead>

					<TableHead key="actions" role="columnheader" className="">
						<></>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invitations.map((invitation) => {
					const statusConfig = INVITATION_STATUSES.find(
						(status) => status.value === invitation.status
					);
					const isExpired =
						invitation.expiresAt && new Date(invitation.expiresAt) < new Date();
					const isPending = invitation.status === InvitationStatus.PENDING;

					return (
						<TableRow key={invitation.id} role="row" tabIndex={0}>
							<TableCell role="gridcell">
								<div className="w-[200px] flex flex-col space-y-1">
									<div className="flex items-center gap-2">
										<div className="font-medium truncate">
											{invitation.email}
										</div>
									</div>
									<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
										<Mail className="h-3 w-3 shrink-0" />
										<span className="truncate">{invitation.email}</span>
									</div>
								</div>
							</TableCell>
							<TableCell role="gridcell">
								<div className="flex flex-col gap-1">
									<Badge
										variant="outline"
										style={{
											backgroundColor: `${statusConfig?.color}20`, // Couleur avec opacity 20%
											color: statusConfig?.color,
											borderColor: `${statusConfig?.color}40`, // Couleur avec opacity 40%
										}}
									>
										{statusConfig?.label}
									</Badge>

									{isPending && isExpired && (
										<span className="text-xs text-destructive flex items-center mt-1">
											<CalendarX className="h-3 w-3 mr-1" />
											Expirée
										</span>
									)}
								</div>
							</TableCell>
							<TableCell role="gridcell">
								<div className="flex flex-col space-y-1 max-w-[180px] text-xs">
									<div className="flex items-center gap-1.5">
										<Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
										<span>
											Envoyée le{" "}
											{format(new Date(invitation.createdAt), "dd MMM yyyy", {
												locale: fr,
											})}
										</span>
									</div>
									{invitation.expiresAt && (
										<div className="flex items-center gap-1.5">
											<CalendarCheck className="h-3 w-3 shrink-0 text-muted-foreground" />
											<span className={cn(isExpired && "text-destructive")}>
												{isExpired ? "Expirée" : "Expire"} le{" "}
												{format(new Date(invitation.expiresAt), "dd MMM yyyy", {
													locale: fr,
												})}
											</span>
										</div>
									)}
								</div>
							</TableCell>

							<TableCell role="gridcell" className="text-right">
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
										{isPending && !isExpired && (
											<>
												<DropdownMenuSeparator />
												<DropdownMenuItem asChild>
													<Link
														href={`/dashboard/${invitation.organization.id}/settings/invitations/${invitation.id}`}
														className={cn("flex w-full items-center")}
													>
														<Edit2 className="h-4 w-4 mr-2" />
														<span>Modifier</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => {
														// Fonction à implémenter pour renvoyer l'invitation
														toast.info("Fonctionnalité à implémenter", {
															description: "Renvoyer l'invitation",
														});
													}}
												>
													<Mail className="h-4 w-4 mr-2" />
													<span>Renvoyer</span>
												</DropdownMenuItem>
											</>
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
