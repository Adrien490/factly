"use client";

import { useTransition } from "react";
import { useDeleteSuppliers } from "../hooks/use-delete-suppliers";

interface DeleteSuppliersButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function DeleteSuppliersButton({
	organizationId,
	ids,
	children,
}: DeleteSuppliersButtonProps) {
	const { dispatch } = useDeleteSuppliers();

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
