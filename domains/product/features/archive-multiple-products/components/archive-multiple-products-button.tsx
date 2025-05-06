"use client";

import { useTransition } from "react";
import { useArchiveMultipleProducts } from "../hooks/use-archive-multiple-products";

interface ArchiveMultipleProductsButtonProps {
	organizationId: string;
	ids: string[];
	children: React.ReactNode;
}

export function ArchiveMultipleProductsButton({
	organizationId,
	ids,
	children,
}: ArchiveMultipleProductsButtonProps) {
	const { dispatch } = useArchiveMultipleProducts();
	const [, startTransition] = useTransition();

	const handleArchive = () => {
		const formData = new FormData();
		ids.forEach((id) => {
			formData.append("ids", id);
		});
		formData.append("organizationId", organizationId);

		startTransition(() => {
			dispatch(formData);
		});
	};

	return <span onClick={handleArchive}>{children}</span>;
}
