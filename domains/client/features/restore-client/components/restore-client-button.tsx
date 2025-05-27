"use client";

import { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreClient } from "../hooks/use-restore-client";

interface RestoreClientButtonProps {
	id: string;
	status: ClientStatus;
	children: React.ReactNode;
}

export function RestoreClientButton({
	id,
	status,
	children,
}: RestoreClientButtonProps) {
	const { dispatch } = useRestoreClient();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
