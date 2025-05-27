"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { RefreshCw } from "lucide-react";
import { useRefreshMembers } from "../../hooks/use-refresh-members";

export function RefreshMembersButton() {
	const { dispatch, isPending } = useRefreshMembers();

	return (
		<form action={dispatch}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="submit" variant="outline" disabled={isPending}>
							<RefreshCw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Rafraîchir la liste des membres</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
