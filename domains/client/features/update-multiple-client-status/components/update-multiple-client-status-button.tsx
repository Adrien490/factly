"use client";

import { ClientStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateMultipleClientStatus } from "../hooks/use-update-multiple-client-status";

interface UpdateMultipleClientStatusButtonProps {
	ids: string[];
	status: ClientStatus;
	children: React.ReactNode;
}

export function UpdateMultipleClientStatusButton({
	ids,
	status,
	children,
}: UpdateMultipleClientStatusButtonProps) {
	const { dispatch } = useUpdateMultipleClientStatus();

	const [, startTransition] = useTransition();

	const handleUpdate = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleUpdate}>{children}</span>;
}
