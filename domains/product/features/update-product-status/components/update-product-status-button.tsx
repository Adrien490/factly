"use client";

import { ProductStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateProductStatus } from "../hooks/use-update-product-status";

interface UpdateProductStatusButtonProps {
	id: string;
	status: ProductStatus;
	children: React.ReactNode;
}

export function UpdateProductStatusButton({
	id,
	status,
	children,
}: UpdateProductStatusButtonProps) {
	const { dispatch } = useUpdateProductStatus();

	const [, startTransition] = useTransition();

	const handleUpdate = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("status", status);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleUpdate}>{children}</span>;
}
