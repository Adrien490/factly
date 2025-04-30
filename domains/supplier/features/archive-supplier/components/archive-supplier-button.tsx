"use client";

import { useTransition } from "react";
import { useArchiveSupplier } from "../hooks/use-archive-supplier";

interface ArchiveSupplierButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function ArchiveSupplierButton({
	organizationId,
	id,
	children,
}: ArchiveSupplierButtonProps) {
	const { dispatch } = useArchiveSupplier();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("organizationId", organizationId);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
