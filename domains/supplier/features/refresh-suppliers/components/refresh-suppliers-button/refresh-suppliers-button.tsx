"use client";

import { Button } from "@/shared/components";
import { RefreshCw } from "lucide-react";
import { useRefreshSuppliers } from "../../hooks";
import { RefreshSuppliersButtonProps } from "./types";

export function RefreshSuppliersButton({
	organizationId,
}: RefreshSuppliersButtonProps) {
	const { dispatch, isPending } = useRefreshSuppliers();

	return (
		<form action={dispatch}>
			<input type="hidden" name="organizationId" value={organizationId} />
			<Button type="submit" variant="outline" disabled={isPending}>
				<RefreshCw className="h-4 w-4" />
			</Button>
		</form>
	);
}
