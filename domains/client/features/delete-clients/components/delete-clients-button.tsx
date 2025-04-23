"use client";
import { useTransition } from "react";
import { useDeleteClients } from "../hooks/use-delete-clients";

interface DeleteClientsButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function DeleteClientsButton({
	organizationId,
	ids,
	children,
}: DeleteClientsButtonProps) {
	const { dispatch } = useDeleteClients();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
