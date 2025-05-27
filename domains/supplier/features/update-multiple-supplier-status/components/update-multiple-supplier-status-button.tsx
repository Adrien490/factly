"use client";

import { SupplierStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateMultipleSupplierStatus } from "../hooks/use-update-multiple-supplier-status";

interface UpdateMultipleSupplierStatusButtonProps {
	ids: string[];
	status: SupplierStatus;
	children: React.ReactNode;
}

export function UpdateMultipleSupplierStatusButton({
	ids,
	status,
	children,
}: UpdateMultipleSupplierStatusButtonProps) {
	const { dispatch } = useUpdateMultipleSupplierStatus();

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
