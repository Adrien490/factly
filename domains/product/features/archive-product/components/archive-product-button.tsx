"use client";

import { useTransition } from "react";
import { useArchiveProduct } from "../hooks/use-archive-product";

interface ArchiveProductButtonProps {
	organizationId: string;
	id: string;
	children: React.ReactNode;
}

export function ArchiveProductButton({
	organizationId,
	id,
	children,
}: ArchiveProductButtonProps) {
	const { dispatch } = useArchiveProduct();
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
