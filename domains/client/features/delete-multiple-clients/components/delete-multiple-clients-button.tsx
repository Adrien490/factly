"use client";
import { useTransition } from "react";
import { useDeleteMultipleClients } from "../hooks/use-delete-multiple-clients";

interface DeleteMultipleClientsButtonProps {
	ids: string[];
	children: React.ReactNode;
}

export function DeleteMultipleClientsButton({
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

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
