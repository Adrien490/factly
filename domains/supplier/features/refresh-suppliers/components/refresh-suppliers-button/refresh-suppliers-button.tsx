"use client";

import { useTransition } from "react";
import { useRefreshSuppliers } from "../../hooks";
import { RefreshSuppliersButtonProps } from "./types";

export function RefreshSuppliersButton({
	organizationId,
	children,
}: RefreshSuppliersButtonProps) {
	const { dispatch } = useRefreshSuppliers();

	const [isPending, startTransition] = useTransition();

	const handleRefresh = () => {
		const formData = new FormData();
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return (
		<span data-pending={isPending ? "true" : undefined} onClick={handleRefresh}>
			{children}
		</span>
	);
}
