"use client";
import { useTransition } from "react";
import { useDeleteClient } from "../hooks/use-delete-client";

interface DeleteClientButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function DeleteClientButton({
	organizationId,
	id,
	children,
}: DeleteClientButtonProps) {
	const { dispatch } = useDeleteClient();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
