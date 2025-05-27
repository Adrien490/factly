"use client";

import { useTransition } from "react";
import { useDeleteProduct } from "../hooks/use-delete-product";

interface DeleteProductButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteProductButton({
	id,
	children,
}: DeleteProductButtonProps) {
	const { dispatch } = useDeleteProduct();

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
