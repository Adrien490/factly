"use client";

import { SupplierStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreMultipleSuppliers } from "../hooks/use-restore-multiple-suppliers";

interface RestoreMultipleSuppliersButtonProps {
	organizationId: string;
	ids: string[];
	status: SupplierStatus;
	children: React.ReactNode;
}

export function RestoreMultipleSuppliersButton({
	organizationId,
	ids,
	status,
	children,
}: RestoreMultipleSuppliersButtonProps) {
	const { dispatch } = useRestoreMultipleSuppliers();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("organizationId", organizationId);
		formData.append("status", status);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
