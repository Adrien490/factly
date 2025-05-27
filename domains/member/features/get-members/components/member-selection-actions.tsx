import { Button } from "@/shared/components";
import { UserMinus, UserX } from "lucide-react";

export interface MemberSelectionActionsProps {
	selectedMemberIds: string[];
}

export function MemberSelectionActions({
	selectedMemberIds,
}: MemberSelectionActionsProps) {
	const selectedCount = selectedMemberIds.length;

	if (selectedCount === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-muted-foreground">
				{selectedCount} membre{selectedCount > 1 ? "s" : ""} sélectionné
				{selectedCount > 1 ? "s" : ""}
			</span>
			<Button variant="outline" size="sm">
				<UserMinus className="mr-2 h-4 w-4" />
				Suspendre
			</Button>
			<Button variant="destructive" size="sm">
				<UserX className="mr-2 h-4 w-4" />
				Retirer
			</Button>
		</div>
	);
}
