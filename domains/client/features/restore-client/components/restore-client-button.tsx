"use client";

import { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreClient } from "../hooks/use-restore-client";

interface RestoreClientButtonProps {
	organizationId: string;
	id: string;
	status: ClientStatus;
	children: React.ReactNode;
}

export function RestoreClientButton({
	organizationId,
	id,
	status,
	children,
}: RestoreClientButtonProps) {
	const { dispatch } = useRestoreClient();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
