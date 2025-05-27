"use client";

import { useTransition } from "react";
import { useArchiveMultipleSuppliers } from "../hooks/use-archive-multiple-suppliers";

interface ArchiveMultipleSuppliersButtonProps {
	ids: string[];
	children: React.ReactNode;
}

export function ArchiveMultipleSuppliersButton({
	ids,
	children,
}: ArchiveMultipleSuppliersButtonProps) {
	const { dispatch } = useArchiveMultipleSuppliers();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
