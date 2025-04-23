"use client";

import { Button } from "@/shared/components";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/shared/components/ui";
import { RefreshCw } from "lucide-react";
import { useRefreshFiscalYears } from "../../hooks/use-refresh-fiscal-years";
import { RefreshFiscalYearsButtonProps } from "./types";

export function RefreshFiscalYearsButton({
	organizationId,
}: RefreshFiscalYearsButtonProps) {
	const { dispatch, isPending } = useRefreshFiscalYears();

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
						<p>Rafraîchir la liste des années fiscales</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</form>
	);
}
