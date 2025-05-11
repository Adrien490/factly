import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Contact } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ContactActionsProps {
	contact: Contact;
}

export function ContactActions({ contact }: ContactActionsProps) {
	const params = useParams();
	const organizationId = params.organizationId as string;
	const clientId = params.clientId as string;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="h-8 w-8 p-0 hover:bg-muted rounded-md"
					aria-label="Actions"
				>
					<MoreHorizontal className="h-4 w-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link
						href={`/dashboard/${organizationId}/clients/${clientId}/contacts/${contact.id}/edit`}
					>
						<Pencil className="mr-2 h-4 w-4" />
						Modifier
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className="text-destructive focus:text-destructive">
					<Trash className="mr-2 h-4 w-4" />
					Supprimer
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
