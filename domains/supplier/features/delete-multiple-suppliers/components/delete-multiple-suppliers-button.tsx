"use client";

import { useTransition } from "react";
import { useDeleteMultipleSuppliers } from "../hooks/use-delete-multiple-suppliers";

interface DeleteMultipleSuppliersButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function DeleteMultipleSuppliersButton({
	organizationId,
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
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleDelete}>{children}</span>;
}
