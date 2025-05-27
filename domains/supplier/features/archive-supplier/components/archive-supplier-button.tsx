"use client";

import { useTransition } from "react";
import { useArchiveSupplier } from "../hooks/use-archive-supplier";

interface ArchiveSupplierButtonProps {
	id: string;
	children: React.ReactNode;
}

export function ArchiveSupplierButton({
	id,
	children,
}: ArchiveSupplierButtonProps) {
	const { dispatch } = useArchiveSupplier();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		formData.append("id", id);
		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
