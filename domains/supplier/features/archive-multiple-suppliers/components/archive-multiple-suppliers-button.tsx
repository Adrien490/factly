"use client";

import { useTransition } from "react";
import { useArchiveMultipleSuppliers } from "../hooks/use-archive-multiple-suppliers";

interface ArchiveMultipleSuppliersButtonProps {
	ids: string[];
	organizationId: string;
	children: React.ReactNode;
}

export function ArchiveMultipleSuppliersButton({
	ids,
	organizationId,
	children,
}: ArchiveMultipleSuppliersButtonProps) {
	const { dispatch } = useArchiveMultipleSuppliers();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => formData.append("ids", id));
		formData.append("organizationId", organizationId);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
