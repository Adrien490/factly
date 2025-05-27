"use client";

import { useTransition } from "react";
import { useDeleteContact } from "../hooks/use-delete-contact";

interface DeleteContactButtonProps {
	id: string;
	clientId?: string;
	supplierId?: string;
	children: React.ReactNode;
}

export function DeleteContactButton({
	id,
	clientId,
	supplierId,
	children,
}: DeleteContactButtonProps) {
	const { dispatch } = useDeleteContact();

	const [, startTransition] = useTransition();

	const handleDelete = () => {
		const formData = new FormData();
		formData.append("id", id);
		if (clientId) formData.append("clientId", clientId);
		if (supplierId) formData.append("supplierId", supplierId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
