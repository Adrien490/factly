import { DeleteClientForm } from "@/domains/client/features/delete-client/components/delete-client-form";
import { Button } from "@/shared/components";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/shared/components/shadcn-ui/alert-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { ClientRowActionsProps } from "./types";

export function ClientRowActions({ client }: ClientRowActionsProps) {
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
			<DropdownMenuContent align="end" side="bottom" sideOffset={4}>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}`}
						className="flex items-center gap-2 cursor-pointer"
					>
						<span className="flex-1 truncate">Voir la fiche client</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/edit`}
						className="flex items-center gap-2 cursor-pointer"
					>
						<span className="flex-1 truncate">Modifier</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/contacts`}
						className="flex items-center gap-2 cursor-pointer"
					>
						<span className="flex-1 truncate">Gestion des contacts</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${client.organizationId}/clients/${client.id}/addresses`}
						className="flex items-center gap-2 cursor-pointer"
					>
						<span className="flex-1 truncate">Gestion des adresses</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="w-full flex items-center justify-start gap-2 px-2 py-1.5 text-sm text-destructive hover:text-destructive focus:text-destructive data-[state=open]:bg-accent"
							>
								<span className="flex-1 truncate text-left">Supprimer</span>
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-lg font-semibold">
									Êtes-vous sûr de vouloir supprimer ce client ?
								</AlertDialogTitle>
								<AlertDialogDescription className="mt-2 text-muted-foreground">
									Cette action est irréversible. Le client &quot;
									{client.name}&quot; sera définitivement supprimé de votre
									organisation.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<DeleteClientForm
								id={client.id}
								organizationId={client.organizationId}
							/>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
