"use client";

import { useTransition } from "react";
import { useRefreshClients } from "../../hooks";
import { RefreshClientsButtonProps } from "./types";

export function RefreshClientsButton({
	organizationId,
	children,
}: RefreshClientsButtonProps) {
	const { dispatch } = useRefreshClients();

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
