"use client";

import { Button } from "@/shared/components";
import { RefreshCw } from "lucide-react";
import { useRefreshMembership } from "../../hooks/use-refresh-membership";

export function RefreshMembershipButton() {
	const { dispatch, isPending } = useRefreshMembership();

	return (
		<form action={dispatch}>
			<Button type="submit" variant="outline" disabled={isPending}>
				<RefreshCw className="h-4 w-4" />
				Réessayer
			</Button>
		</form>
	);
}
