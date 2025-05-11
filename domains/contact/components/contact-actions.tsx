import { DeleteContactAlertDialog } from "@/domains/contact/features/delete-contact/components/delete-contact-alert-dialog";
import { GetContactReturn } from "@/domains/contact/features/get-contact";
import { UpdateContactSheetForm } from "@/domains/contact/features/update-contact/components/update-contact-sheet-form";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { cn } from "@/shared/utils";
import { MoreVerticalIcon } from "lucide-react";

interface ContactActionsProps {
	contact: NonNullable<GetContactReturn>;
}

export function ContactActions({ contact }: ContactActionsProps) {
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
				<UpdateContactSheetForm contact={contact}>
					<DropdownMenuItem preventDefault>Modifier</DropdownMenuItem>
				</UpdateContactSheetForm>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					preventDefault
					className="text-destructive focus:text-destructive p-0"
				>
					<DeleteContactAlertDialog
						organizationId={
							(contact.client?.organizationId ||
								contact.supplier?.organizationId) ??
							""
						}
						id={contact.id}
						clientId={contact.clientId ?? undefined}
						supplierId={contact.supplierId ?? undefined}
					>
						<span className="w-full text-left px-2 py-1.5">Supprimer</span>
					</DeleteContactAlertDialog>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
