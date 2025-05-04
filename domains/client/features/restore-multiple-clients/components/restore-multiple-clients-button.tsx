"use client";

import { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreMultipleClients } from "../hooks/use-restore-multiple-clients";

interface RestoreMultipleClientsButtonProps {
	organizationId: string;
	ids: string[];
	status: ClientStatus;
	children: React.ReactNode;
}

export function RestoreMultipleClientsButton({
	organizationId,
	ids,
	status,
	children,
}: RestoreMultipleClientsButtonProps) {
	const { dispatch } = useRestoreMultipleClients();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("organizationId", organizationId);
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
