"use client";

import { SupplierStatus } from "@prisma/client";
import { useTransition } from "react";
import { useUpdateSupplierStatus } from "../hooks/use-update-supplier-status";

interface UpdateSupplierStatusButtonProps {
	organizationId: string;
	id: string;
	status: SupplierStatus;
	children: React.ReactNode;
}

export function UpdateSupplierStatusButton({
	organizationId,
	id,
	status,
	children,
}: UpdateSupplierStatusButtonProps) {
	const { dispatch } = useUpdateSupplierStatus();

	const [, startTransition] = useTransition();

	const handleUpdate = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		formData.append("status", status);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleUpdate}>{children}</span>;
}
