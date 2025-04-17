import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shared/components";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface ActionMenuProps {
	id: string;
	clientId?: string;
	supplierId?: string;
}

export function ActionMenu({ id, clientId, supplierId }: ActionMenuProps) {
	// Déterminer le contexte (client ou fournisseur) pour les liens
	const baseUrl = clientId
		? `/clients/${clientId}/addresses`
		: `/suppliers/${supplierId}/addresses`;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem asChild>
					<Link href={`${baseUrl}/${id}/edit`} className="cursor-pointer">
						Modifier
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href={`${baseUrl}/${id}/delete`}
						className="cursor-pointer text-destructive"
					>
						Supprimer
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
