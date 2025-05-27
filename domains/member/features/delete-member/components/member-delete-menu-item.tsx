"use client";

import { DropdownMenuItem } from "@/shared/components";
import { UserX } from "lucide-react";
import { DeleteMemberAlertDialog } from "./delete-member-alert-dialog";

interface MemberDeleteMenuItemProps {
	memberId: string;
	memberName: string;
	disabled?: boolean;
}

export function MemberDeleteMenuItem({
	memberId,
	memberName,
	disabled = false,
}: MemberDeleteMenuItemProps) {
	if (disabled) {
		return (
			<DropdownMenuItem disabled className="text-muted-foreground">
				<UserX className="mr-2 h-4 w-4" />
				Retirer de l&apos;organisation
			</DropdownMenuItem>
		);
	}

	return (
		<DeleteMemberAlertDialog id={memberId} memberName={memberName}>
			<DropdownMenuItem
				className="text-destructive focus:text-destructive"
				onSelect={(e) => e.preventDefault()} // Empêche la fermeture du menu
			>
				<UserX className="mr-2 h-4 w-4" />
				Retirer de l&apos;organisation
			</DropdownMenuItem>
		</DeleteMemberAlertDialog>
	);
}
