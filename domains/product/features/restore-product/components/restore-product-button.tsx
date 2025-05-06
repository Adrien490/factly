"use client";

import { ProductStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreProduct } from "../hooks/use-restore-product";

interface RestoreProductButtonProps {
	organizationId: string;
	id: string;
	status: ProductStatus;
	children: React.ReactNode;
}

export function RestoreProductButton({
	organizationId,
	id,
	status,
	children,
}: RestoreProductButtonProps) {
	const { dispatch } = useRestoreProduct();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
