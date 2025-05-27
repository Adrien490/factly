"use client";

import { useTransition } from "react";
import { useDeleteClient } from "../hooks/use-delete-client";

interface DeleteClientButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteClientButton({ id, children }: DeleteClientButtonProps) {
	const { dispatch } = useDeleteClient();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
