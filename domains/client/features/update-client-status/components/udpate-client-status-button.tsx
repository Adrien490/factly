"use client";

import { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateClientStatus } from "../hooks/use-update-client-status";

interface UpdateClientStatusButtonProps {
	id: string;
	status: ClientStatus;
	children: React.ReactNode;
}

export function UpdateClientStatusButton({
	id,
	status,
	children,
}: UpdateClientStatusButtonProps) {
	const { dispatch } = useUpdateClientStatus();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("status", status);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
