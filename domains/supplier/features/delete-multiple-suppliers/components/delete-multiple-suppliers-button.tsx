"use client";

import { useTransition } from "react";
import { useDeleteMultipleSuppliers } from "../hooks/use-delete-multiple-suppliers";

interface DeleteMultipleSuppliersButtonProps {
	ids: string[];
	children: React.ReactNode;
}

export function DeleteMultipleSuppliersButton({
	ids,
	children,
}: DeleteMultipleSuppliersButtonProps) {
	const { dispatch } = useDeleteMultipleSuppliers();

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
