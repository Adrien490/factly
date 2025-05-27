"use client";

import { ProductStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateMultipleProductStatus } from "../hooks/use-update-multiple-product-status";

interface UpdateMultipleProductStatusButtonProps {
	ids: string[];
	status: ProductStatus;
	children: React.ReactNode;
}

export function UpdateMultipleProductStatusButton({
	ids,
	status,
	children,
}: UpdateMultipleProductStatusButtonProps) {
	const { dispatch } = useUpdateMultipleProductStatus();

	const [, startTransition] = useTransition();

	const handleUpdate = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleUpdate}>{children}</span>;
}
