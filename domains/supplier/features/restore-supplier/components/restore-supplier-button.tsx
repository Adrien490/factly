"use client";

import { SupplierStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRestoreSupplier } from "../hooks/use-restore-supplier";

interface RestoreSupplierButtonProps {
	id: string;
	status: SupplierStatus;
	children: React.ReactNode;
}

export function RestoreSupplierButton({
	id,
	status,
	children,
}: RestoreSupplierButtonProps) {
	const { dispatch } = useRestoreSupplier();
	const [, startTransition] = useTransition();

	const handleRestore = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("status", status);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleRestore}>{children}</span>;
}
