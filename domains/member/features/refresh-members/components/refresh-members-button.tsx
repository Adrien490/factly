"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { useRefreshMembers } from "../hooks/use-refresh-members";

export function RefreshMembersButton() {
	const { dispatch, isPending } = useRefreshMembers();

	return (
		<form action={dispatch}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="submit" variant="outline" disabled={isPending}>
							Réessayer
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
