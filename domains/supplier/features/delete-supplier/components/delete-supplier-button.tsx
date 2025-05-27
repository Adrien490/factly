"use client";

import { useTransition } from "react";
import { useDeleteSupplier } from "../hooks/use-delete-supplier";

interface DeleteSupplierButtonProps {
	id: string;
	children: React.ReactNode;
}

export function DeleteSupplierButton({
	id,
	children,
}: DeleteSupplierButtonProps) {
	const { dispatch } = useDeleteSupplier();

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
