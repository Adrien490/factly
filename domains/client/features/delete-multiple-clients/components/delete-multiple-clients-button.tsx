"use client";
import { useTransition } from "react";
import { useDeleteMultipleClients } from "../hooks";

interface DeleteMultipleClientsButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function DeleteMultipleClientsButton({
	organizationId,
	ids,
	children,
}: DeleteMultipleClientsButtonProps) {
	const { dispatch } = useDeleteMultipleClients();

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
