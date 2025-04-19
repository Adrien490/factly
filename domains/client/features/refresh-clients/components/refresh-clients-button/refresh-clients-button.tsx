"use client";

import { Button } from "@/shared/components";
import { RefreshCw } from "lucide-react";
import { useRefreshClients } from "../../hooks";
import { RefreshClientsButtonProps } from "./types";

export function RefreshClientsButton({
	organizationId,
}: RefreshClientsButtonProps) {
	const { dispatch, isPending } = useRefreshClients();

	return (
		<form action={dispatch}>
			<input type="hidden" name="organizationId" value={organizationId} />
			<Button type="submit" variant="outline" disabled={isPending}>
				<RefreshCw className="h-4 w-4" />
			</Button>
		</form>
	);
}
