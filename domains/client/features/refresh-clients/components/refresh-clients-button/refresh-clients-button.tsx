"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useRefreshClients } from "../../hooks/use-refresh-clients";

export function RefreshClientsButton() {
	const { dispatch, isPending } = useRefreshClients();
	const params = useParams();
	const organizationId = params.organizationId as string;

	return (
		<form action={dispatch}>
			<input type="hidden" name="organizationId" value={organizationId} />
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button type="submit" variant="outline" disabled={isPending}>
							<RefreshCw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Rafraîchir la liste des clients</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
