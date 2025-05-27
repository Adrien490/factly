"use client";

import { ProductStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreMultipleProducts } from "../hooks/use-restore-multiple-products";

interface RestoreMultipleProductsButtonProps {
	ids: string[];
	status: ProductStatus;
	children: React.ReactNode;
}

export function RestoreMultipleProductsButton({
	ids,
	status,
	children,
}: RestoreMultipleProductsButtonProps) {
	const { dispatch } = useRestoreMultipleProducts();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
