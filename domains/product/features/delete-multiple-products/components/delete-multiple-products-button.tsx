"use client";
import { useTransition } from "react";
import { useDeleteMultipleProducts } from "../hooks/use-delete-multiple-products";

interface DeleteMultipleProductsButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function DeleteMultipleProductsButton({
	organizationId,
	ids,
	children,
}: DeleteMultipleProductsButtonProps) {
	const { dispatch } = useDeleteMultipleProducts();

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
