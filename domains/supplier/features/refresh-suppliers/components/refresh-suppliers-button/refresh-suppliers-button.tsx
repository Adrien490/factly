"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { RefreshCw } from "lucide-react";
import { useRefreshSuppliers } from "../../hooks/use-refresh-suppliers";
import { RefreshSuppliersButtonProps } from "./types";

export function RefreshSuppliersButton({
	organizationId,
}: RefreshSuppliersButtonProps) {
	const { dispatch, isPending } = useRefreshSuppliers();

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
						<p>Rafraîchir la liste des fournisseurs</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
