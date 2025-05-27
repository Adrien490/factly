import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components";
import { MoreHorizontal, UserMinus, UserX } from "lucide-react";
import { GetMemberReturn } from "../../get-member/types";

export interface MemberActionsProps {
	member: NonNullable<GetMemberReturn>;
}

export function MemberActions({}: MemberActionsProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Ouvrir le menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<UserMinus className="mr-2 h-4 w-4" />
					Suspendre le membre
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-destructive">
					<UserX className="mr-2 h-4 w-4" />
					Retirer de l&apos;organisation
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
