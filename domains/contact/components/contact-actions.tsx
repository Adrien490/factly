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
	DropdownMenuTrigger,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";
import { DeleteContactButton } from "../features/delete-contact/components/delete-contact-button";
import { GetContactsReturn } from "../features/get-contacts/types";
import { SetDefaultContactButton } from "../features/set-default-contact/components/set-default-contact-button";

interface ContactActionsProps {
	contact: GetContactsReturn[number];
}

export function ContactActions({ contact }: ContactActionsProps) {
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
				{!contact.isDefault && (
					<>
						<SetDefaultContactButton
							id={contact.id}
							clientId={contact.clientId || undefined}
							supplierId={contact.supplierId || undefined}
						>
							<DropdownMenuItem>
								<span>Définir par défaut</span>
							</DropdownMenuItem>
						</SetDefaultContactButton>
						<DropdownMenuSeparator />
					</>
				)}

				<DropdownMenuItem
					preventDefault
					className="text-destructive focus:text-destructive p-0"
				>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<div className="flex items-center px-2 py-1.5 w-full">
								<span>Supprimer</span>
							</div>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-destructive">
									Êtes-vous sûr de vouloir supprimer ce contact ?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Cette action va supprimer définitivement le contact.
									<br />
									Cette action est irréversible.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Annuler</AlertDialogCancel>
								<DeleteContactButton id={contact.id}>
									<AlertDialogAction>Supprimer</AlertDialogAction>
								</DeleteContactButton>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
