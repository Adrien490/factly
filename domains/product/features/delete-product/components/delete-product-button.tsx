"use client";

import { useTransition } from "react";
import { useDeleteProduct } from "../hooks/use-delete-product";

interface DeleteProductButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function DeleteProductButton({
	organizationId,
	id,
	children,
}: DeleteProductButtonProps) {
	const { dispatch } = useDeleteProduct();

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
